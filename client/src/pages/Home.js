import React, { useEffect } from "react";
import { MDBCol, MDBContainer, MDBRow, MDBTypography } from "mdb-react-ui-kit";
import { useDispatch, useSelector } from "react-redux";
import { getTours } from "../redux/features/tourSlice";
import CardTour from "../components/CardTour";
import Spinner from "../components/Spinner";
import Pagination from "../components/Pagination";
import { useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Home = () => {
  const dispatch = useDispatch();
  const { tours, loading, currentPage, numberOfPages } = useSelector((state) => state.tour);
  const query = useQuery();
  const searchQuery = query.get("searchQuery");

  useEffect(() => {
    dispatch(getTours(currentPage));
  }, [dispatch, currentPage]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div style={{ margin: "auto", padding: "15px", maxWidth: "1000px", alignContent: "center" }}>
      <MDBRow className="mt-5">
        {tours.length === 0 && (
          <MDBTypography className="text-center mb-0" tag="h2">
{searchQuery ? `No results for "${searchQuery}"` : "No Tours Found"}
          </MDBTypography>
        )}

        <MDBCol>
          <MDBContainer>
            <MDBRow className="row-cols-1 row-cols-md-3 g-2">
              {tours.map((item) => (
                <CardTour key={item._id} {...item} />
              ))}
            </MDBRow>
          </MDBContainer>
        </MDBCol>
      </MDBRow>

      {tours.length > 0 && <Pagination currentPage={currentPage} numberOfPages={numberOfPages} />}
    </div>
  );
};

export default Home;