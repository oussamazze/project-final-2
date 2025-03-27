import React, { useEffect, useState } from "react";
import { MDBCard, MDBCardBody, MDBCardText, MDBCardImage, MDBContainer, MDBIcon, MDBBtn, MDBInput } from "mdb-react-ui-kit";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import { getRelatedTours, getTour, addComment, deleteComment } from "../redux/features/tourSlice";
import RelatedTours from "../components/RelatedTours";
import DisqusThread from "../components/DisqusThread";
import { toast } from "react-toastify";
const SingleTour = () => {
  const dispatch = useDispatch();
  const { tour, relatedTours } = useSelector((state) => ({ ...state.tour }));
  const { id } = useParams();
  const navigate = useNavigate();
  const tags = tour?.tags;
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(tour?.comments || []);
  
  useEffect(() => {
    if (id) {
      dispatch(getTour(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (tags) {
      dispatch(getRelatedTours(tags));
    }
  }, [tags, dispatch]);

  useEffect(() => {
    setComments(tour?.comments || []);
  }, [tour?.comments]);

  const user = JSON.parse(localStorage.getItem("profile")); // Récupérer l'utilisateur depuis le localStorage

  const handleAddComment = () => {
    if (comment.trim()) {
      if (!user || !user.result || !user.result.name) {
        alert("Vous devez être connecté pour commenter !");
        return;
      }

      const newComment = {
        userName: user.result.name, // Utilisation du vrai nom de l'utilisateur
        text: comment,
        createdAt: new Date(),
      };

      setComments([...comments, newComment]); // Mise à jour immédiate de l'affichage

      dispatch(addComment({ id, comment })).then(() => {
        dispatch(getTour(id)); // Rafraîchir les données après l'ajout
      });

      setComment(""); // Réinitialiser le champ après l'ajout
    }
  };

  const handleDeleteComment = (commentId) => {
    if (!user || !user.result || !user.result.name) {
      alert("Vous devez être connecté pour supprimer un commentaire !");
      return;
    }

    dispatch(deleteComment({ tourId: id, commentId, toast })).then(() => {
      dispatch(getTour(id)); // Rafraîchir les données après suppression
    });
  };

  return (
    <MDBContainer>
      <MDBCard className="mb-3 mt-2">
        <MDBCardImage
          position="top"
          style={{ width: "100%", maxHeight: "600px" }}
          src={tour.imageFile}
          alt={tour.title}
        />
        <MDBCardBody>
          <MDBBtn
            tag="a"
            color="none"
            style={{ float: "left", color: "#000" }}
            onClick={() => navigate("/")}
          >
            <MDBIcon fas size="lg" icon="long-arrow-alt-left" style={{ float: "left" }} />
          </MDBBtn>
          <h3>{tour.title}</h3>
          <span>
            <p className="text-start tourName">Created By: {tour.name}</p>
          </span>
          <div style={{ float: "left" }}>
            <span className="text-start">
              {tour?.tags?.map((item) => `#${item} `)}
            </span>
          </div>
          <br />
          <MDBCardText className="text-start mt-2">
            <MDBIcon style={{ float: "left", margin: "5px" }} far icon="calendar-alt" size="lg" />
            <small className="text-muted">{moment(tour.createdAt).fromNow()}</small>
          </MDBCardText>
          <MDBCardText className="lead mb-0 text-start">{tour.description}</MDBCardText>

          {/* Section Commentaires */}
          <div className="mt-4">
            <h5>Commentaires :</h5>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <MDBCard key={comment._id || Math.random()} className="mt-2 p-2">
                  <MDBCardText><strong>{comment.userName}:</strong> {comment.text}</MDBCardText>
                  <small className="text-muted">{moment(comment.createdAt).fromNow()}</small>
                  {user?.result?.name === comment.userName && (
                    <MDBBtn
                      size="sm"
                      color="danger"
                      className="ms-2"
                      onClick={() => handleDeleteComment(comment._id)}
                    >
                      <MDBIcon fas icon="trash" />
                    </MDBBtn>
                  )}
                </MDBCard>
              ))
            ) : (
              <p>Aucun commentaire pour le moment.</p>
            )}
          </div>

          {/* Ajouter un commentaire */}
          <div className="mt-3">
            <MDBInput
              label="Ajouter un commentaire"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <MDBBtn className="mt-2" color="primary" onClick={handleAddComment}>
              <MDBIcon fas icon="comment" className="me-2" />
              Commenter
            </MDBBtn>
          </div>
        </MDBCardBody>
        <RelatedTours relatedTours={relatedTours} tourId={id} />
      </MDBCard>
      <DisqusThread id={id} title={tour.title} path={`/tour/${id}`} />
    </MDBContainer>
  );
};

export default SingleTour;
