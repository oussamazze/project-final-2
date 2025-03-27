import React from "react";
import { MDBPagination, MDBPaginationItem, MDBBtn } from "mdb-react-ui-kit";
import { useDispatch } from "react-redux";
import { setCurrentPage } from "../redux/features/tourSlice";

const Pagination = ({ currentPage, numberOfPages }) => {
  const dispatch = useDispatch();

  const handleNext = () => {
    if (currentPage < numberOfPages) {
      dispatch(setCurrentPage(currentPage + 1));
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      dispatch(setCurrentPage(currentPage - 1));
    }
  };

  if (numberOfPages <= 1) return null;

  return (
    <div className="mt-4">
      <MDBPagination center className="mb-0">
        <MDBPaginationItem>
          <MDBBtn rounded className="mx-2" onClick={handlePrev} disabled={currentPage === 1}>
            Prev
          </MDBBtn>
        </MDBPaginationItem>
        <MDBPaginationItem>
          <p className="fw-bold mt-1">{currentPage}</p>
        </MDBPaginationItem>
        <MDBPaginationItem>
          <MDBBtn rounded className="mx-2" onClick={handleNext} disabled={currentPage === numberOfPages}>
            Next
          </MDBBtn>
        </MDBPaginationItem>
      </MDBPagination>
    </div>
  );
};

export default Pagination;
