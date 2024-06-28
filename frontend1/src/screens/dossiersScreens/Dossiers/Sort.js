import React from "react";
import { Button, ButtonGroup, Dropdown, DropdownButton } from "react-bootstrap";

const Sort = ({ sort, setSort }) => {
  const onSelectChange = (e) => {
    console.log(e);
    setSort({
      sort: e,
      order: sort.order,
    });
  };

  const onArrowChange = () => {
    if (sort.order === "asc")
      setSort({
        sort: sort.sort,
        order: "desc",
      });
    else
      setSort({
        sort: sort.sort,
        order: "asc",
      });
  };

  return (
    <div>
      <p>ترتيب حسب:</p>
      <ButtonGroup>
        <DropdownButton
          as={ButtonGroup}
          title={sort.sort}
          id="bg-nested-dropdown"
          onSelect={onSelectChange}
        >
          <Dropdown.Item eventKey={"notes"}>النقاط</Dropdown.Item>
          <Dropdown.Item eventKey={"date_depo"}>تاريخ الايداع</Dropdown.Item>
          <Dropdown.Item eventKey={"nom"}>اللقب بالفرنسية</Dropdown.Item>
          <Dropdown.Item eventKey={"prenom"}>الاسم بالفرنسية</Dropdown.Item>
          <Dropdown.Item eventKey={"date_n"}>تاريخ الميلاد</Dropdown.Item>
        </DropdownButton>
        <Button onClick={onArrowChange}>&uarr;&darr;</Button>
      </ButtonGroup>
    </div>
  );
};

export default Sort;
