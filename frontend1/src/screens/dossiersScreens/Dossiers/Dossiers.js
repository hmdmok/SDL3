import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MainScreen from "../../../components/MainScreen/MainScreen";
import ErrorMessage from "../../../components/ErrorMessage";
import Loading from "../../../components/Loading";
import Tools from "./Tools";
import Filters from "./Filters";
import SingleDossier from "./SingleDossier";
import { Badge, Card, ListGroup } from "react-bootstrap";
import {
  deleteDossierAction,
  listDossiersAction,
} from "../../../actions/dossierActions";

function Dossiers() {
  const dispatch = useDispatch();
  const dossierList = useSelector((state) => state.dossierList);
  const { loading, dossiers, error } = dossierList;

  const dossierDelete = useSelector((state) => state.dossierDelete);
  const {
    success: successDossierDelete,
    loading: loadingDossierDelete,
    error: errorDossierDelete,
  } = dossierDelete;
  const deleteHandler = (id) => {
    dispatch(deleteDossierAction(id));
    setShowPopup(false); // Close the popup after deleting
  };
  const handleCancelDelete = () => {
    setShowPopup(false); // Close the popup without deleting
  };
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ sort: "notes", order: "desc" });
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [p_m_35_dd, setP_m_35_dd] = useState("");
  const [p_m_35_de, setP_m_35_de] = useState({ dateEtude: "", type: "" });
  const [situationFamiliale, setSituationFamiliale] = useState("");
  const [dateEtude, setDateEtude] = useState("");
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility
  const [idToDel, setIdToDel] = useState(null); // State to control popup visibility

  useEffect(() => {
    dispatch(
      listDossiersAction(
        page,
        limit,
        search,
        sort,
        fromDate,
        toDate,
        p_m_35_dd,
        p_m_35_de,
        situationFamiliale
      )
    );
  }, [
    dispatch,
    successDossierDelete,
    page,
    limit,
    search,
    sort,
    fromDate,
    toDate,
    p_m_35_dd,
    p_m_35_de,
    situationFamiliale,
    dateEtude,
  ]);
  return (
    <>
      <div className="alerts">
        {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
        {loading && <Loading />}

        {errorDossierDelete && (
          <ErrorMessage variant="danger">{errorDossierDelete}</ErrorMessage>
        )}
        {loadingDossierDelete && <Loading />}
        {showPopup && (
          <div className="popup">
            <div className="popup-content">
              <p>هل انت متاكد من حذف هذا الملف؟</p>
              <button
                onClick={() => {
                  deleteHandler(idToDel);
                }}
              >
                نعم
              </button>
              <button onClick={handleCancelDelete}>لا</button>
            </div>
          </div>
        )}
      </div>
      <ListGroup>
        <Tools
          limit={dossiers?.limit ? dossiers.limit : 20}
          total={dossiers?.total ? dossiers.total : 0}
          data={dossiers?.data ? dossiers.data : {}}
          totalArray={dossiers?.totalArray ? dossiers.totalArray : {}}
          setPage={setPage}
          page={page}
          key={"tools"}
        />
      </ListGroup>
      <MainScreen title={"البحث عبر الملفات "}>
        <div className="rigthPanel">
          <Filters
            limit={dossiers?.limit ? dossiers.limit : 20}
            p_m_35_dd={p_m_35_dd}
            p_m_35_de={p_m_35_de}
            situationFamiliale={situationFamiliale}
            fromDate={fromDate}
            toDate={toDate}
            search={search}
            sort={sort}
            dateEtude={dateEtude}
            setFromDate={setFromDate}
            setToDate={setToDate}
            setSearch={setSearch}
            setSort={setSort}
            setPage={setPage}
            setLimit={setLimit}
            setP_m_35_dd={setP_m_35_dd}
            setP_m_35_de={setP_m_35_de}
            setSituationFamiliale={setSituationFamiliale}
            setDateEtude={setDateEtude}
            key={"filter"}
          />
        </div>

        <ListGroup>
          <div className="">
            <Card style={{ display: "flex", flexDirection: "row-reverse" }}>
              <ListGroup variant="flush" style={{ width: "9rem" }}>
                <Badge bg="warning" text="dark" style={{ height: "40px" }}>
                  {" Nom:"}
                </Badge>
              </ListGroup>
              <ListGroup variant="flush" style={{ width: "9rem" }}>
                <Badge bg="warning" text="dark" style={{ height: "40px" }}>
                  Prenom:
                </Badge>
              </ListGroup>
              <ListGroup variant="flush" style={{ width: "9rem" }}>
                <Badge bg="warning" text="dark" style={{ height: "40px" }}>
                  Date naissance:
                </Badge>
              </ListGroup>

              <ListGroup variant="flush" style={{ width: "7rem" }}>
                <Badge bg="warning" text="dark" style={{ height: "40px" }}>
                  {"Num Doss:"}
                </Badge>
              </ListGroup>

              <ListGroup variant="flush" style={{ width: "5rem" }}>
                <Badge bg="warning" text="dark" style={{ height: "40px" }}>
                  {"Notes:"}
                </Badge>
              </ListGroup>

              <ListGroup variant="flush" style={{ width: "7rem" }}>
                <Badge bg="warning" text="dark" style={{ height: "40px" }}>
                  {"Situation:"}
                </Badge>
              </ListGroup>

              <ListGroup variant="flush" style={{ width: "8rem" }}>
                <Badge bg="warning" text="dark" style={{ height: "40px" }}>
                  {"Date depot:"}
                </Badge>
              </ListGroup>
            </Card>
          </div>
          {dossiers?.data?.map((dossierMap) => {
            return (
              <SingleDossier
                dossierMap={dossierMap}
                key={dossierMap._id}
                setShowPopup={setShowPopup}
                deleteHandler={deleteHandler}
                setIdToDel={setIdToDel}
              />
            );
          })}
        </ListGroup>
      </MainScreen>
    </>
  );
}

export default Dossiers;
