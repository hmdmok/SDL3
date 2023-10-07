import React from "react";
import { Button } from "react-bootstrap";

const ImportPhotoTools = () => {
  return (
    <div className="tools">
      <h5> اعدادات رفع صور الملفات</h5> <hr />
      <Button className="m-1 " onClick={() => {}}>
        {"التحقق من وجود الملفات"}
      </Button>
      <Button className="m-1 " onClick={() => {}}>
        {"رفع  صور الملفات"}
      </Button>
    </div>
  );
};

export default ImportPhotoTools;
