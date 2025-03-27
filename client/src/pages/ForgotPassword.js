import React, { useState } from "react";
import { MDBCard, MDBCardBody, MDBInput, MDBBtn } from "mdb-react-ui-kit";
import { toast } from "react-toastify";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Veuillez entrer un email valide.");
      return;
    }

    try {
      const { data } = await axios.post("http://localhost:5000/users/forgot-password", { email });
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Une erreur est survenue.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", marginTop: "100px" }}>
      <MDBCard>
        <MDBCardBody>
          <h4>Mot de passe oublié</h4>
          <form onSubmit={handleSubmit}>
            <MDBInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <MDBBtn type="submit" className="mt-3" block>
              Envoyer le lien de réinitialisation
            </MDBBtn>
          </form>
        </MDBCardBody>
      </MDBCard>
    </div>
  );
};

export default ForgotPassword;
