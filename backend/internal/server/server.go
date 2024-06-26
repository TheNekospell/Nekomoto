package server

import (
	"fmt"
	"log"
	"net/http"

	"github.com/ethereum/go-ethereum/common"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/swaggo/files"
	"github.com/swaggo/gin-swagger"

	"backend/internal/model"
	"backend/internal/server/service"
)

func StartServer() {

	fmt.Println("server init")

	gin.SetMode(gin.ReleaseMode)
	engine := gin.New()
	//engine.Use(gin.LoggerWithWriter(gin.DefaultWriter), gin.Recovery())

	// cors
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowMethods = []string{"GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type", "Authorization"}
	config.ExposeHeaders = []string{"Content-Length"}
	config.AllowCredentials = true
	engine.Use(cors.New(config))

	// fmt.Println("server init swagger")
	engine.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	apiGroup := engine.Group("/api")

	apiGroup.GET("/ping", func(c *gin.Context) {
		c.String(http.StatusOK, "pong")
	})

	boxGroup := apiGroup.Group("/box")
	boxGroup.POST("/summon", SummonBox)

	chestGroup := apiGroup.Group("/chest")
	chestGroup.POST("/open", OpenChest)
	chestGroup.POST("/empower", EmpowerChest)

	addressGroup := apiGroup.Group("/address")
	addressGroup.PUT("/generateSignature", GenerateSignature)
	addressGroup.POST("/info", AddressInfo)
	addressGroup.POST("/invitation", AcceptInvitation)
	addressGroup.POST("valid", ValidSignature)

	rewardGroup := apiGroup.Group("/reward")
	rewardGroup.POST("/claim", ClaimReward)

	testGroup := apiGroup.Group("/nike")
	testGroup.GET("/allocate", func(ctx *gin.Context) {
		service.AllocateProfit()
	})
	testGroup.GET("/chest", func(ctx *gin.Context) {
		service.GiveChest()
	})
	testGroup.POST("/summon", func(ctx *gin.Context) {
		var req model.AddressAndCountAndSignature

		if err := ctx.ShouldBindJSON(&req); err != nil {
			fmt.Println("error: ", err)
			ErrorResponse(ctx, model.WrongParam, err.Error())
			return
		}
		_, _ = service.SummonBox(req.Address, req.Count)
	})

	// fmt.Println("server started at:", engine)
	if err := engine.Run(":8972"); err != nil {
		log.Fatalln(err)
	}

}

func SuccessResponse(c *gin.Context, data interface{}) {
	c.JSON(http.StatusOK, model.ResponseData{
		Code:    model.Success,
		Success: true,
		Message: "",
		Data:    data,
	})
}

func ErrorResponse(c *gin.Context, code model.ResponseCode, message string) {
	c.JSON(http.StatusOK, model.ResponseData{
		Code:    code,
		Success: false,
		Message: message,
		Data:    nil,
	})
}

func GenerateSignature(c *gin.Context) {
	// for now maybe is enough for this
	var req model.Address
	if err := c.ShouldBindJSON(&req); err != nil {
		ErrorResponse(c, model.WrongParam, err.Error())
		return
	}
	if !common.IsHexAddress(req.Address) {
		ErrorResponse(c, model.WrongParam, "invalid address")
		return
	}
	data, code, msg := service.GenerateSignature(req.Address)
	if code != model.Success {
		ErrorResponse(c, code, msg)
		return
	}
	SuccessResponse(c, data)
}

func SummonBox(c *gin.Context) {
	var req model.AddressAndCountAndSignature

	if err := c.ShouldBindJSON(&req); err != nil {
		ErrorResponse(c, model.WrongParam, err.Error())
		return
	}

	if err := service.ValidSignature(req.Address, req.Signature.SignText, req.Signature.Signature); err != nil {
		ErrorResponse(c, model.InvalidSignature, err.Error())
		return
	}
	code, msg := service.SummonBox(req.Address, req.Count)
	if code != model.Success {
		ErrorResponse(c, code, msg)
		return
	}
	SuccessResponse(c, msg)
}

func OpenChest(c *gin.Context) {
	var req model.AddressAndSignature
	err := c.ShouldBindJSON(&req)
	if err != nil {
		ErrorResponse(c, model.WrongParam, err.Error())
		return
	}

	if err := service.ValidSignature(req.Address, req.Signature.SignText, req.Signature.Signature); err != nil {
		ErrorResponse(c, model.InvalidSignature, err.Error())
		return
	}

	code, msg := service.OpenChest(req)
	if code != model.Success {
		ErrorResponse(c, code, msg)
		return
	}
	SuccessResponse(c, msg)
}

func EmpowerChest(c *gin.Context) {
	var req model.TwoAddressAndSignature
	if err := c.ShouldBindJSON(&req); err != nil {
		ErrorResponse(c, model.WrongParam, err.Error())
		return
	}
	if err := service.ValidSignature(req.Address1, req.Signature.SignText, req.Signature.Signature); err != nil {
		ErrorResponse(c, model.InvalidSignature, err.Error())
		return
	}

	code, msg := service.EmpowerChest(req)
	if code != model.Success {
		ErrorResponse(c, code, msg)
		return
	}
	SuccessResponse(c, msg)
}

func AcceptInvitation(c *gin.Context) {
	var req model.AddressAndCodeAndSignature
	if err := c.ShouldBindJSON(&req); err != nil {
		ErrorResponse(c, model.WrongParam, err.Error())
		return
	}

	if err := service.ValidSignature(req.Address, req.Signature.SignText, req.Signature.Signature); err != nil {
		ErrorResponse(c, model.InvalidSignature, err.Error())
		return
	}
	// if !common.IsHexAddress(req.Address) {
	// 	ErrorResponse(c, model.WrongParam, "invalid address")
	// 	return
	// }
	code, msg := service.AcceptInvitation(req)
	if code != model.Success {
		ErrorResponse(c, code, msg)
		return
	}
	SuccessResponse(c, msg)
}

func AddressInfo(c *gin.Context) {
	var req model.Address
	if err := c.ShouldBindJSON(&req); err != nil {
		ErrorResponse(c, model.WrongParam, err.Error())
		return
	}
	if !common.IsHexAddress(req.Address) {
		ErrorResponse(c, model.WrongParam, "invalid address")
		return
	}
	data, code, msg := service.AddressInfo(req)
	if code != model.Success {
		ErrorResponse(c, code, msg)
		return
	}
	SuccessResponse(c, data)
}

func ClaimReward(c *gin.Context) {
	var req model.AddressAndSignature
	if err := c.ShouldBindJSON(&req); err != nil {
		ErrorResponse(c, model.WrongParam, err.Error())
		return
	}
	if !common.IsHexAddress(req.Address) {
		ErrorResponse(c, model.WrongParam, "invalid address")
		return
	}
	if err := service.ValidSignature(req.Address, req.Signature.SignText, req.Signature.Signature); err != nil {
		ErrorResponse(c, model.InvalidSignature, err.Error())
		return
	}
	code, msg := service.ClaimReward(req)
	if code != model.Success {
		ErrorResponse(c, code, msg)
		return
	}
	SuccessResponse(c, msg)
}

func ValidSignature(c *gin.Context) {
	var req model.AddressAndSignature
	if err := c.ShouldBindJSON(&req); err != nil {
		ErrorResponse(c, model.WrongParam, err.Error())
		return
	}
	if err := service.ValidSignature(req.Address, req.Signature.SignText, req.Signature.Signature); err != nil {
		ErrorResponse(c, model.InvalidSignature, err.Error())
		return
	}
	SuccessResponse(c, true)
}

// func OpenStarterChest(c *gin.Context) {
// 	var req model.AddressAndSignature
// 	if err := c.ShouldBindJSON(&req); err != nil {
// 		ErrorResponse(c, model.WrongParam, err.Error())
// 		return
// 	}
// 	if !common.IsHexAddress(req.Address) {
// 		ErrorResponse(c, model.WrongParam, "invalid address")
// 		return
// 	}
// 	if err := service.ValidSignature(req.Address, req.Signature.SignText, req.Signature.Signature); err != nil {
// 		ErrorResponse(c, model.InvalidSignature, err.Error())
// 		return
// 	}
// 	code, msg := service.OpenStarterChest(req)
// 	if code != model.Success {
// 		ErrorResponse(c, code, msg)
// 		return
// 	}
// 	SuccessResponse(c, msg)
// }