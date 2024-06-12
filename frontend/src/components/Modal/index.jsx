import "./index.css";
import { Modal, Flex } from "antd";
import BoxBorder from "@components/BoxBorder/index";

import close from "@assets/close.png";

export default function NekoModal({ isModalOpen, title, children, onClose }) {

  return (
    <Modal
      title=""
      open={isModalOpen}
      footer={null}
      closable={false}
      onCancel={onClose}
    >
      <BoxBorder />
      <Flex className="modal-close" justify="space-between" align="center" style={{marginBottom:'24px'}}>
        <div className="modal-title">{title}</div>
        <img src={close} width={24} onClick={onClose} />
      </Flex>
      {
        children
      }
    </Modal>
  );
}
