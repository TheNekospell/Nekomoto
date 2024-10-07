package server

import (
	// "backend/internal/invoker_sn"
	"fmt"
	"log"
	// "math/big"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"backend/internal/model"
	"backend/internal/server/service"
)

func StartServer() {

	fmt.Println("server init")

	gin.SetMode(gin.ReleaseMode)
	engine := gin.Default()
	//engine.Use(gin.LoggerWithWriter(gin.DefaultWriter), gin.Recovery())

	// cors
	// config := cors.DefaultConfig()
	// config.AllowAllOrigins = true
	// config.AllowOrigins = []string{"http://localhost:5173/"}
	// config.AllowCredentials = true
	// config.AllowMethods = []string{"GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"}
	// config.AllowHeaders = []string{"Origin", "Referer", "Host", "Accept", "Content-Length", "Content-Type", "Authorization", "Token"}
	// config.ExposeHeaders = []string{"Content-Length", "Access-Control-Allow-Headers", "Token"}
	engine.Use(cors.Default())

	// fmt.Println("server init swagger")
	// engine.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	apiGroup := engine.Group("/api")

	apiGroup.GET("/ping", func(c *gin.Context) {
		c.String(http.StatusOK, "pong")
	})

	boxGroup := apiGroup.Group("/box")
	boxGroup.POST("/summon", SummonBox)

	// chestGroup := apiGroup.Group("/chest")
	// chestGroup.POST("/open", OpenChest)
	// chestGroup.POST("/empower", EmpowerChest)

	addressGroup := apiGroup.Group("/address")
	addressGroup.GET("/generateSignature", GenerateSignature)
	addressGroup.GET("/info", AddressInfo)
	// addressGroup.POST("/invitation", AcceptInvitation)
	// addressGroup.POST("/valid", ValidSignature)
	addressGroup.POST("/active", ActiveAddress)

	rewardGroup := apiGroup.Group("/reward")
	rewardGroup.POST("/claim", ClaimReward)
	// rewardGroup.POST("/claimInv", ClaimRewardOfInvitation)

	staticGroup := apiGroup.Group("/static")
	staticGroup.GET("/info", GetStaticInfo)

	testGroup := apiGroup.Group("/nike")
	testGroup.GET("/allocate", func(ctx *gin.Context) {
		service.AllocateProfit()
	})
	testGroup.GET("/chest", func(ctx *gin.Context) {
		service.GiveChest()
	})
	// testGroup.POST("/summon", func(ctx *gin.Context) {
	// 	_ = invoker_sn.SendCoinAndNFT("", big.NewInt(100000), big.NewInt(10000), big.NewInt(10))
	// })
	// testGroup.GET("/faucet", func(ctx *gin.Context) {
	// 	var req model.Address
	// 	if err := ctx.ShouldBind(&req); err != nil {
	// 		ErrorResponse(ctx, model.WrongParam, err.Error())
	// 		return
	// 	}
	// 	bigIntNumber := new(big.Int)
	// 	bigIntNumber.SetString("250000000000000000000000", 10)
	// 	bigIntNumber2 :=new(big.Int)
	// 	bigIntNumber2.SetString("1000000000000000000", 10)
	// 	err := invoker_sn.SendCoinAndNFT(req.Address, bigIntNumber,bigIntNumber2 , big.NewInt(1))
	// 	if err != nil {
	// 		ErrorResponse(ctx, model.ServerInternalError, err.Error())
	// 		return
	// 	}
	// 	SuccessResponse(ctx, "success")
	// })

	// fmt.Println("server started at:", engine)
	if err := engine.Run(":8972"); err != nil {
		log.Fatalln(err)
	}

}

// func aaa() gin.HandlerFunc {
// 	cfg := cors.Config{
// 		AllowMethods:     []string{"*"},
// 		AllowHeaders:     []string{"*"},
// 		AllowCredentials: false,
// 		MaxAge:           12 * time.Hour,
// 	}
// 	cfg.AllowAllOrigins = true
// 	return cors.New(cfg)
// }

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
	if err := c.ShouldBind(&req); err != nil {
		ErrorResponse(c, model.WrongParam, err.Error())
		return
	}
	// if !common.IsHexAddress(req.Address) {
	// 	ErrorResponse(c, model.WrongParam, "invalid address")
	// 	return
	// }
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

	if err := service.ValidSignature(req.Address, req.Signature.TypedData, req.Signature.Signature); err != nil {
		ErrorResponse(c, model.InvalidSignature, err.Error())
		return
	}
	data, code, msg := service.SummonBox(req.Address, req.Count)
	if code != model.Success {
		ErrorResponse(c, code, msg)
		return
	}
	SuccessResponse(c, data)
}

func OpenChest(c *gin.Context) {
	var req model.AddressAndSignature
	err := c.ShouldBindJSON(&req)
	if err != nil {
		ErrorResponse(c, model.WrongParam, err.Error())
		return
	}

	if err := service.ValidSignature(req.Address, req.Signature.TypedData, req.Signature.Signature); err != nil {
		ErrorResponse(c, model.InvalidSignature, err.Error())
		return
	}

	data, code, msg := service.OpenChest(req)
	if code != model.Success {
		ErrorResponse(c, code, msg)
		return
	}
	SuccessResponse(c, data)
}

func EmpowerChest(c *gin.Context) {
	var req model.TwoAddressAndSignature
	if err := c.ShouldBindJSON(&req); err != nil {
		ErrorResponse(c, model.WrongParam, err.Error())
		return
	}
	if err := service.ValidSignature(req.Address1, req.Signature.TypedData, req.Signature.Signature); err != nil {
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

	if err := service.ValidSignature(req.Address, req.Signature.TypedData, req.Signature.Signature); err != nil {
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
	if err := c.ShouldBind(&req); err != nil {
		ErrorResponse(c, model.WrongParam, err.Error())
		return
	}
	// if !common.IsHexAddress(req.Address) {
	// 	ErrorResponse(c, model.WrongParam, "invalid address")
	// 	return
	// }
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
	// if !common.IsHexAddress(req.Address) {
	// 	ErrorResponse(c, model.WrongParam, "invalid address")
	// 	return
	// }
	if err := service.ValidSignature(req.Address, req.Signature.TypedData, req.Signature.Signature); err != nil {
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

func ClaimRewardOfInvitation(c *gin.Context) {
	var req model.AddressAndSignature
	if err := c.ShouldBindJSON(&req); err != nil {
		ErrorResponse(c, model.WrongParam, err.Error())
		return
	}
	if err := service.ValidSignature(req.Address, req.Signature.TypedData, req.Signature.Signature); err != nil {
		ErrorResponse(c, model.InvalidSignature, err.Error())
		return
	}
	code, msg := service.ClaimRewardOfInvitation(req)
	if code != model.Success {
		ErrorResponse(c, code, msg)
		return
	}
	SuccessResponse(c, msg)
}

func ValidSignature(c *gin.Context) {
	var req model.AddressAndSignature

	if err := c.ShouldBindJSON(&req); err != nil {
		fmt.Println("signature valid error: ", err)
		ErrorResponse(c, model.WrongParam, err.Error())
		return
	}

	if err := service.ValidSignature(req.Address, req.Signature.TypedData, req.Signature.Signature); err != nil {
		fmt.Println("signature valid error: ", err)
		ErrorResponse(c, model.InvalidSignature, err.Error())
		return
	}
	fmt.Println("signature valid")
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
// 	if err := service.ValidSignature(req.Address,  req.Signature.TypedData, req.Signature.Signature); err != nil {
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

func GetStaticInfo(c *gin.Context) {
	data, code, msg := service.GetStaticInfo()
	if code != model.Success {
		ErrorResponse(c, code, msg)
		return
	}
	SuccessResponse(c, data)
}

func ActiveAddress(c *gin.Context) {
	var req model.AddressAndCode

	if err := c.ShouldBindJSON(&req); err != nil {
		ErrorResponse(c, model.WrongParam, err.Error())
		return
	}

	code, msg := service.ActiveAddress(req.Address, req.Code)
	if code != model.Success {
		ErrorResponse(c, code, msg)
		return
	}
	SuccessResponse(c, msg)
}
