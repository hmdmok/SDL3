import React, { useEffect, useState } from "react";
import { Accordion, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import MainScreen from "../../components/MainScreen/MainScreen";
import axios from "axios";

function Dossiers() {

  const [newDossiers, setNewDossiers] = useState([])

  const fetchDossiers = async () => {
    const { data } = await axios.get("/api/dossiers");
    setNewDossiers(data);
  };

  useEffect(() => {
    fetchDossiers();
  }, []);

  const dossiersCild = (
    <div>
      <Link to="/createdossier">
        <Button>اضافة ملف جديد</Button>
      </Link>
      {newDossiers.map((dossierMap) => (
        <Accordion key={dossierMap.id}>
          <Accordion.Item eventKey={dossierMap.id} className="m-2">
            <Card.Header className="d-flex">
              <Accordion.Header
                style={{
                  color: "black",
                  textDecoration: "none",
                  flex: 1,
                  cursor: "pointer",
                  alignSelf: "center",
                  fontSize: 18,
                }}
              >
                الملف رقم : {dossierMap.id} {dossierMap.nom} ,{" "}
                {dossierMap.prenom}
              </Accordion.Header>

              <div>
                <Button
                  href={`/dossier/${dossierMap.id}`}
                  variant="success"
                  className="mx-2"
                >
                  تعديل
                </Button>
                <Button variant="danger" className="mx-2">
                  حذف
                </Button>
              </div>
            </Card.Header>

            <Accordion.Body>
              <blockquote>
                <table className="table table-hover">
                  <tbody>
                    <tr>
                      <th scope="col">رقم</th>
                      <th className={dossierMap.id_dossier} scope="row">
                        {dossierMap.id}
                      </th>
                    </tr>
                    <tr>
                      <th scope="col">الاسم</th>
                      <td className={dossierMap.id_dossier}>
                        {dossierMap.prenom}
                      </td>
                    </tr>
                    <tr>
                      <th scope="col">اللقب</th>
                      <td className={dossierMap.id_dossier}>
                        {dossierMap.nom}
                      </td>
                    </tr>
                    <tr>
                      <th scope="col">تاريخ الميلاد</th>
                      <td className={dossierMap.id_dossier}>
                        {dossierMap.date_n.split("T")[0]}
                      </td>
                    </tr>
                    <tr>
                      <th scope="col">مكان الميلاد</th>
                      <td className={dossierMap.id_dossier}>
                        {dossierMap.lieu_n}
                      </td>
                    </tr>
                    <tr>
                      <th scope="col">رقم عقد الميلاد</th>
                      <td className={dossierMap.id_dossier}>
                        {dossierMap.num_act}
                      </td>
                    </tr>
                    <tr>
                      <th scope="col">اسم الاب</th>
                      <td className={dossierMap.id_dossier}>
                        {dossierMap.prenom_p}
                      </td>
                    </tr>
                    <tr>
                      <th scope="col">اسم الام</th>
                      <td className={dossierMap.id_dossier}>
                        {dossierMap.prenom_m}
                      </td>
                    </tr>
                    <tr>
                      <th scope="col">لقب الام</th>
                      <td className={dossierMap.id_dossier}>
                        {dossierMap.nom_m}
                      </td>
                    </tr>
                    <tr>
                      <th scope="col">الوضعية العائلية</th>
                      <td className={dossierMap.id_dossier}>
                        {dossierMap.stuation_f}
                      </td>
                    </tr>
                    <tr>
                      <th scope="col">الوضعية المهنية</th>
                      <td className={dossierMap.id_dossier}>
                        {dossierMap.situation_p}
                      </td>
                    </tr>
                    <tr>
                      <th scope="col">الدخل</th>
                      <td className={dossierMap.id_dossier}>
                        {dossierMap.salaire}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </blockquote>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      ))}
    </div>
  );
  return (
    <div>
      <MainScreen title="عرض كل الملفات الموجودة" children={dossiersCild} />
    </div>
  );
}

export default Dossiers;
