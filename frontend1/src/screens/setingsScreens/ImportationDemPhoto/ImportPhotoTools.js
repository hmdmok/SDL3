import { Button } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { getDossierByNumAction } from "../../../actions/dossierActions";
import { useDispatch, useSelector } from "react-redux";

const ImportPhotoTools = ({ photo_files }) => {
  const dispatch = useDispatch();

  const [listDossiersWithPhotos, setListDossiersWithPhotos] = useState([]);
  const [listPhotosWithNoDossier, setListPhotosWithNoDossier] = useState([]);

  const dossierGet = useSelector((state) => state.dossierGet);
  const { dossier, success, error } = dossierGet;

  const getDossiersListFrom = (photoList) => {
    setListDossiersWithPhotos([]);
    setListPhotosWithNoDossier([]);
    // eslint-disable-next-line array-callback-return
    photoList.map((photo) => {
      // get dossier num from photo name
      const num_dos_from_photo1 = photo.name?.split(".")[0];
      const num_dos_from_photo3 = num_dos_from_photo1.split(" ")[0];
      const num_dos_from_photo2 = num_dos_from_photo3.split("-");
      console.log(num_dos_from_photo2);
      let num_dos_from_photo;
      if (num_dos_from_photo2[1])
        num_dos_from_photo =
          num_dos_from_photo2[0] + "-" + num_dos_from_photo2[1];
      else num_dos_from_photo = num_dos_from_photo2[0];

      // try to get the dossier id
      console.log(num_dos_from_photo);
      dispatch(getDossierByNumAction(num_dos_from_photo, photo));
    });
  };

  useEffect(() => {
    let newlist = [];
    // if dossier egsist add the dossier to first list
    if (success) {
      newlist = listDossiersWithPhotos;
      newlist.push(dossier);
      setListDossiersWithPhotos(newlist);
    } else {
      // if dossier doesnot egsist add photo to the second lis
      newlist = listPhotosWithNoDossier;
      if (error) newlist.push(error);
      setListPhotosWithNoDossier(newlist);
    }
    console.log(listPhotosWithNoDossier);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dossier, success, error]);
  return (
    <div className="tools">
      <h5> اعدادات رفع صور الملفات</h5> <hr />
      <Button
        className="m-1 "
        onClick={() => {
          getDossiersListFrom(photo_files);
        }}
      >
        {"التحقق من وجود الملفات"}
      </Button>
      <Button className="m-1 " onClick={() => {}}>
        {"رفع  صور الملفات"}
      </Button>
    </div>
  );
};

export default ImportPhotoTools;
