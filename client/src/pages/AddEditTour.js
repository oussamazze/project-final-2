import React, { useState, useEffect } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBValidation,
  MDBBtn,
  MDBInput,
} from "mdb-react-ui-kit";
import ChipInput from "material-ui-chip-input";
import FileBase from "react-file-base64";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createTour, updateTour } from "../redux/features/tourSlice";

const initialState = {
  title: "",
  description: "",
  tags: [],
};

const styles = {
  container: {
    margin: "auto",
    padding: "15px",
    maxWidth: "450px",
    alignContent: "center",
    marginTop: "120px",
    background: "linear-gradient(135deg, #f6d365, #fda085)",
    borderRadius: "12px",
    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
    paddingBottom: "20px",
  },
  card: {
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
    transition: "transform 0.3s ease-in-out",
  },
  cardHover: {
    transform: "scale(1.02)",
  },
  input: {
    border: "2px solid #ff6f61",
    borderRadius: "8px",
    padding: "10px",
    fontSize: "16px",
    transition: "border 0.3s ease",
  },
  btnSubmit: {
    width: "100%",
    backgroundColor: "#ff6f61",
    color: "#fff",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  btnClear: {
    width: "100%",
    backgroundColor: "#dc3545",
    color: "#fff",
    fontWeight: "bold",
  },
};

const AddEditTour = () => {
  const [tourData, setTourData] = useState(initialState);
  const [tagErrMsg, setTagErrMsg] = useState(null);
  const { error, userTours } = useSelector((state) => state.tour);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const singleTour = userTours.find((tour) => tour._id === id);
      if (singleTour) {
        setTourData({ ...singleTour });
      }
    }
  }, [id, userTours]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!tourData.tags.length) {
      setTagErrMsg("Please provide some tags");
      return;
    }

    if (tourData.title && tourData.description && tourData.tags.length > 0) {
      const updatedTourData = { ...tourData, name: user?.result?.name };

      if (!id) {
        dispatch(createTour({ updatedTourData, navigate, toast }));
      } else {
        dispatch(updateTour({ id, updatedTourData, toast, navigate }));
      }
      handleClear();
    }
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setTourData({ ...tourData, [name]: value });
  };

  const handleAddTag = (tag) => {
    setTagErrMsg(null);
    setTourData({ ...tourData, tags: [...tourData.tags, tag] });
  };

  const handleDeleteTag = (deleteTag) => {
    setTourData({
      ...tourData,
      tags: tourData.tags.filter((tag) => tag !== deleteTag),
    });
  };

  const handleClear = () => {
    setTourData(initialState);
  };

  return (
    <div style={styles.container} className="container">
      <MDBCard alignment="center" style={styles.card}>
        <h5 style={{ color: "#ff6f61", fontWeight: "bold" }}>
          {id ? "Update Tour" : "Add Tour"}
        </h5>
        <MDBCardBody>
          <MDBValidation onSubmit={handleSubmit} className="row g-3" noValidate>
            <div className="col-md-12">
              <MDBInput
                placeholder="Enter Title"
                type="text"
                value={tourData.title}
                name="title"
                onChange={onInputChange}
                className="form-control"
                required
                style={styles.input}
              />
            </div>
            <div className="col-md-12">
              <MDBInput
                placeholder="Enter Description"
                type="text"
                value={tourData.description}
                name="description"
                onChange={onInputChange}
                className="form-control"
                required
                textarea
                rows={4}
                style={styles.input}
              />
            </div>
            <div className="col-md-12">
              <ChipInput
                name="tags"
                variant="outlined"
                placeholder="Enter Tag"
                fullWidth
                value={tourData.tags}
                onAdd={handleAddTag}
                onDelete={handleDeleteTag}
                style={styles.input}
              />
              {tagErrMsg && <div className="text-danger">{tagErrMsg}</div>}
            </div>
            <div className="d-flex justify-content-start">
              <FileBase
                type="file"
                multiple={false}
                onDone={({ base64 }) =>
                  setTourData({ ...tourData, imageFile: base64 })
                }
              />
            </div>
            <div className="col-12">
              <MDBBtn
                style={styles.btnSubmit}
                onClick={handleSubmit}
                disabled={!tourData.title || !tourData.description || !tourData.tags.length}
              >
                {id ? "Update" : "Submit"}
              </MDBBtn>
              <MDBBtn
                style={styles.btnClear}
                className="mt-2"
                onClick={handleClear}
              >
                Clear
              </MDBBtn>
            </div>
          </MDBValidation>
        </MDBCardBody>
      </MDBCard>
    </div>
  );
};

export default AddEditTour;
