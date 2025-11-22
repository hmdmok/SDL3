import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MainScreen from "../../../components/MainScreen/MainScreen";
import ErrorMessage from "../../../components/ErrorMessage";
import Loading from "../../../components/Loading";
import Tools from "./Tools";
import Filters from "./Filters";
import { ListGroup } from "react-bootstrap";
import {
  deleteDossierAction,
  listBrothersDossiersAction,
  listDossiersAction,
} from "../../../actions/dossierActions";
import ListDossiers from "./ListDossiers";
import ListBrothers from "./ListBrothers";

function Dossiers() {
  const dispatch = useDispatch();

  const dossierList = useSelector((state) => state.dossierList);
  const { loading, dossiers, error } = dossierList;

  const dossierBrothersList = useSelector((state) => state.dossierBrothersList);
  const {
    loading: dossierBrothersListLoading,
    brothers,
    error: dossierBrothersListError,
  } = dossierBrothersList;

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
  const [fatherPage, setFatherPage] = useState(1);
  const [motherPage, setMotherPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ sort: "notes", order: "desc" });
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [p_m_35_dd, setP_m_35_dd] = useState("");
  const [p_m_35_de, setP_m_35_de] = useState({ dateEtude: "", type: "" });
  const [situationFamiliale, setSituationFamiliale] = useState("");
  const [dateEtude, setDateEtude] = useState("");
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility
  const [showBrothersList, setShowBrothetherList] = useState("List"); // State to control popup visibility
  const [idToDel, setIdToDel] = useState(null); // State to control popup visibility

  // Fetch main dossiers — depends only on main page and filters
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

  // Fetch brothers lists — only fetches when the active brother view or its page changes
  useEffect(() => {
    if (showBrothersList === "FatherBrothers") {
      dispatch(
        listBrothersDossiersAction(
          fatherPage,
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
    } else if (showBrothersList === "MotherBrothers") {
      dispatch(
        listBrothersDossiersAction(
          motherPage,
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
    } else {
      // overview/stats view: fetch with main page to populate summary
      dispatch(
        listBrothersDossiersAction(
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
    }
  }, [
    dispatch,
    successDossierDelete,
    showBrothersList,
    fatherPage,
    motherPage,
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

        {dossierBrothersListError && (
          <ErrorMessage variant="danger">
            {dossierBrothersListError}
          </ErrorMessage>
        )}
        {dossierBrothersListLoading && <Loading />}

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
        {/* Show Tools for main dossiers or for brother views using the server-paged response */}
        {showBrothersList === "List" && (
          <Tools
            limit={dossiers?.limit ? dossiers.limit : 20}
            total={dossiers?.total ? dossiers.total : 0}
            data={dossiers?.data ? dossiers.data : {}}
            totalArray={dossiers?.totalArray ? dossiers.totalArray : {}}
            setPage={setPage}
            page={page}
            key={"tools"}
          />
        )}
        {showBrothersList === "FatherBrothers" && (
          <Tools
            limit={brothers?.limit ? brothers.limit : 20}
            total={brothers?.total ? brothers.total : 0}
            data={
              brothers?.fatherBrothersList ? brothers.fatherBrothersList : []
            }
            totalArray={brothers?.totalArray ? brothers.totalArray : {}}
            setPage={setFatherPage}
            page={fatherPage}
            key={"tools-father"}
          />
        )}
        {showBrothersList === "MotherBrothers" && (
          <Tools
            limit={brothers?.limit ? brothers.limit : 20}
            total={brothers?.total ? brothers.total : 0}
            data={
              brothers?.motherBrothersList ? brothers.motherBrothersList : []
            }
            totalArray={brothers?.totalArray ? brothers.totalArray : {}}
            setPage={setMotherPage}
            page={motherPage}
            key={"tools-mother"}
          />
        )}
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
            setShowBrothetherList={setShowBrothetherList}
            showBrothersList={showBrothersList}
            numberFatherBrothers={brothers?.stats?.fatherGroups}
            numberMotherBrothers={brothers?.stats?.motherGroups}
          />
        </div>

        {showBrothersList === "List" && (
          <ListDossiers
            key={"listDossiers"}
            title={"قائمة الملفات كاملة"}
            setShowPopup={setShowPopup}
            deleteHandler={deleteHandler}
            setIdToDel={setIdToDel}
            dossiers={dossiers}
          />
        )}
        {showBrothersList === "FatherBrothers" && (
          <ListBrothers
            key={"fatherBrothers"}
            title={"قائمة الخوة من الاب"}
            setShowPopup={setShowPopup}
            deleteHandler={deleteHandler}
            setIdToDel={setIdToDel}
            dossiers={brothers?.fatherBrothersList}
            showBrothersList={showBrothersList}
          />
        )}
        {showBrothersList === "MotherBrothers" && (
          <ListBrothers
            key={"motherBrothers"}
            title={"قائمة الخوة من الام"}
            setShowPopup={setShowPopup}
            deleteHandler={deleteHandler}
            setIdToDel={setIdToDel}
            dossiers={brothers?.motherBrothersList}
            showBrothersList={showBrothersList}
          />
        )}
      </MainScreen>
    </>
  );
}

export default Dossiers;
