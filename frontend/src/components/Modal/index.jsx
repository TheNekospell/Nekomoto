import "./index.css";
import { Modal, Flex } from "antd";
import BoxBorder from "@components/BoxBorder/index";

import close from "@assets/close.png";

export default function NekoModal({open, title, children, onCancel}) {
    
    return (
        <Modal
            title=""
            open={open}
            footer={null}
            closable={false}
            onCancel={onCancel}
            centered={true}
        >
            <BoxBorder/>
            <Flex className="modal-close" justify="space-between" align="center" style={{marginBottom: '24px'}}>
                <div className="modal-title">{title}</div>
                <img src={close} width={24} onClick={onCancel}/>
            </Flex>
            {
                children
            }
        </Modal>
    );
}
