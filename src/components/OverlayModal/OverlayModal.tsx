import React from 'react';
import ReactDOM from 'react-dom';
import { MdClose } from 'react-icons/md';

const modalRoot = document.getElementsByTagName('body');

interface Props {
  open: boolean;
  onClose: () => void;
}

interface State {
  open: boolean;
}
class OverlayModal extends React.Component<Props, State> {
  el: HTMLDivElement;
  constructor(props: Props) {
    super(props);
    this.el = document.createElement('div');
    this.state = {
      open: props.open,
    };
  }

  componentDidMount() {
    if (modalRoot.length === 0) {
      throw new Error('cannot find body tag');
    }
    modalRoot[0].appendChild(this.el);
  }

  componentWillUnmount() {
    if (modalRoot.length !== 0) modalRoot[0].removeChild(this.el);
  }

  handleClose = () => {
    this.setState({
      open: false,
    });
    this.props.onClose();
  };

  render() {
    const { open } = this.state;
    if (!open) {
      return null;
    }
    return ReactDOM.createPortal(
      <div className="flex justify-center items-center bg-slate-300 bg-opacity-25 h-screen fixed inset-0 overflow-y-auto">
        <div className="bg-white p-2 relative rounded-lg shadow-md shadow-slate-500 border border-slate-300">
          <div className="border-2 border-slate-600 text-slate-600 rounded-full absolute top-2 right-2 text-sm flex justify-center items-center">
            <MdClose className="text-lg" onClick={this.handleClose} />
          </div>
          <div className="p-7">{this.props.children}</div>
        </div>
      </div>,
      this.el,
    );
  }
}

export default OverlayModal;
