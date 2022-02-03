import React, { ReactChild, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useKeyPress, useOutsideClick } from '../../hooks';

interface Props {
  children: ReactChild;
  open: boolean;
  onClose: () => void;
}

const modalRoot = document.getElementsByTagName('body');
const element = document.createElement('div');

const OverlayModal: React.FC<Props> = (props: Props) => {
  const [open, setOpen] = useState(props.open);
  const ref = useRef<HTMLDivElement>(null);
  const escPressed = useKeyPress('Escape');

  const closeOverlay = () => {
    setOpen(false);
    props.onClose();
  };

  useOutsideClick(ref, closeOverlay);

  useEffect(() => {
    if (escPressed) {
      closeOverlay();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [escPressed]);

  useEffect(() => {
    if (modalRoot.length === 0) {
      throw new Error('cannot find body tag');
    }
    modalRoot[0].appendChild(element);
    return () => {
      if (modalRoot.length !== 0) modalRoot[0].removeChild(element);
    };
  }, []);

  if (!open) {
    return null;
  }
  return ReactDOM.createPortal(
    <div
      className="fixed z-10 inset-0 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* <!--
    Background overlay, show/hide based on modal state.

    Entering: "ease-out duration-300"
      From: "opacity-0"
      To: "opacity-100"
    Leaving: "ease-in duration-200"
      From: "opacity-100"
      To: "opacity-0"
  --> */}
        <div
          className="fixed inset-0 bg-slate-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"></div>

        {/* <!-- This element is to trick the browser into centering the modal contents. --> */}
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true">
          &#8203;
        </span>

        {/* <!--
    Modal panel, show/hide based on modal state.

    Entering: "ease-out duration-300"
      From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      To: "opacity-100 translate-y-0 sm:scale-100"
    Leaving: "ease-in duration-200"
      From: "opacity-100 translate-y-0 sm:scale-100"
      To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
  --> */}
        <div
          ref={ref}
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              {props.open && props.children}
            </div>
          </div>
        </div>
      </div>
    </div>,
    element,
  );
};

export default OverlayModal;
