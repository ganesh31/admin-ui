import React, { ChangeEvent, useState } from 'react';
import { MdOutlineYoutubeSearchedFor } from 'react-icons/md';

import SearchBar from '../../SearchBar';

interface SearchObj {
  columnId: string;
  searchText: string;
}
interface Props {
  value: string;
  id: string;
  needSearch?: boolean;
  onSearch?: ({ columnId, searchText }: SearchObj) => void;
  onClose: (id: string) => void;
}

const ColumnCell: React.FC<Props> = (props: Props) => {
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchText, setSearchText] = useState('');

  const onShowSearchBar = () => {
    setShowSearchBar(true);
  };

  const onHideSearchBar = () => {
    setShowSearchBar(false);
    setSearchText('');
    if (props.onClose) props.onClose(props.id);
  };

  const onSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const searchObj: SearchObj = {
      columnId: props.id,
      searchText: event.target.value,
    };
    setSearchText(event.target.value);
    if (props.onSearch) props.onSearch(searchObj);
  };

  if (!showSearchBar) {
    const cellWithIcon = (
      <span className="flex justify-between align-middle">
        {props.value}
        {props.needSearch && (
          <MdOutlineYoutubeSearchedFor
            className="text-2xl"
            onClick={onShowSearchBar}
          />
        )}
      </span>
    );
    return <th className="text-left p-4">{cellWithIcon}</th>;
  }

  return (
    <th className="text-left p-4">
      <SearchBar
        placeholder={props.value}
        value={searchText}
        name={props.value}
        onChange={onSearch}
        onClose={onHideSearchBar}
        showClose
      />
    </th>
  );
};

export default ColumnCell;
