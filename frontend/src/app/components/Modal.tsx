"use client";
import React, { useEffect } from "react";
// store
import { useAppStore } from "../store";
// styles
import {
  MainModal,
  Modal as ModalContainer,
  ModalBody,
  ModalText,
} from "../styles/shared/Modal.styles";
// utils
import { screens } from "../utils/data";
import { CustomImage } from "../styles/shared/Image.styles";

interface IProps {
  id: string;
  timeout?: number;
}

const Modal = (props: IProps) => {
  const { id } = props;

  const {
    modal: {
      assets: { alertCancel, alertSuccess },
    },
  } = screens;

  const { deleteFromMessageState, messageState } = useAppStore();

  const { message, success } = messageState[id];
  let { timeoutInMilliseconds } = messageState[id];

  const timeout = timeoutInMilliseconds || 10000;

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      deleteFromMessageState(id);
    }, timeout);

    return () => {
      clearTimeout(timeoutId);
    };
  });

  return (
    <MainModal
      $animationDuration={timeout}
      $success={success}
      onClick={() => deleteFromMessageState(id)}
    >
      <CustomImage
        src={success ? alertSuccess.src : alertCancel.src}
        alt="alert"
        $size="30px"
      />
      <ModalContainer>
        <ModalText>{success ? "Success" : "Error"}</ModalText>
        <ModalBody>{message}</ModalBody>
      </ModalContainer>
    </MainModal>
  );
};

export default Modal;
