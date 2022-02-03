import { ChangeEvent, FC, useState } from 'react';
import Textfield from '../components/Textfield';

interface Props {
  name: string;
  value: string;
  onChange: (value: string) => void;
}

const EditTextfield: FC<Props> = (props: Props) => {
  const [value, setValue] = useState(props.value || '');
  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    props.onChange(event.target.value);
  };
  return (
    <Textfield
      name={props.name}
      placeholder={props.name}
      value={value}
      onChange={handleOnChange}
    />
  );
};

export default EditTextfield;
