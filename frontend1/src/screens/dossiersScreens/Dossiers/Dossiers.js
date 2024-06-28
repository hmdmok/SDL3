import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MainScreen from "../../../components/MainScreen/MainScreen";
import ErrorMessage from "../../../components/ErrorMessage";
import Loading from "../../../components/Loading";
import Tools from "./Tools";
import Filters from "./Filters";
import SingleDossier from "./SingleDossier";
import { ListGroup } from "react-bootstrap";
import { listDossiersAction } from "../../../actions/dossierActions";

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
  const [total, setTotal] = useState(0);
  const [data, setData] = useState({});

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
      </div>
      <ListGroup>
        <Tools
          limit={dossiers?.limit ? dossiers.limit : 20}
          total={dossiers?.total ? dossiers.total : 0}
          data={dossiers?.data ? dossiers.data : {}}
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
          {dossiers?.data?.map((dossierMap) => {
            return (
              <SingleDossier dossierMap={dossierMap} key={dossierMap._id} />
            );
          })}
        </ListGroup>
      </MainScreen>
    </>
  );
}

export default Dossiers;
