import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CreateZone() {
  let history = useHistory();

  const [zone, setZone] = useState({
    zoneId: "",
    zoneName: "",
    cost: ""
  });

  useEffect(() => {
    const loggedInUser = localStorage.getItem("userData");
    if (!loggedInUser) {
      history.push("/login");
    }
    const foundUser = JSON.parse(loggedInUser);
    if (foundUser.user.role !== "admin") {
      history.push("/login");
    }
  });

  function createZone(event) {
    const loggedInUser = localStorage.getItem("userData");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);

      if (foundUser.user.role === "admin") {
        const config = {
          headers: { Authorization: "Bearer " + foundUser.token }
        };
        axios
          .post("http://localhost:5000/zone/", zone, config)
          .then((response) => {
            console.log(response);
            toast.success("Bölge Başarıyla Oluşturuldu!", {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined
            });
          });
        setZone({
          zoneId: "",
          zoneName: "",
          cost: ""
        });
      } else {
        history.push("/login");
      }
    } else {
      history.push("/login");
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setZone((preValues) => {
      return {
        ...preValues,
        [name]: value
      };
    });
    event.preventDefault();
  }

  return (
    <div>
      <Navbar page="Create Zone" />
      <div className="container">
        <h1
          className="text-dark"
          style={{ fontSize: "75px", textAlign: "center", marginTop: "5rem" }}
        >
          Bölge Oluştur
        </h1>
        <div className="row justify-content-center">
          <div className="col-md-9 col-lg-12 col-xl-10">
            <div className="card shadow-lg o-hidden border-0 my-5">
              <div className="card-body p-0">
                <div className="row">
                  <div className="col-lg-6 d-none d-lg-flex">
                    <div
                      className="flex-grow-1 bg-login-image"
                      style={{
                        backgroundImage:
                          "url(https://st3.depositphotos.com/9881890/15397/i/600/depositphotos_153977506-stock-photo-vintage-light-bulb.jpg)",
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        width: "100%",
                        height: "100%"
                      }}
                    ></div>
                  </div>
                  <div className="col-lg-6">
                    <div className="p-5">
                      <form className="user">
                        <div className="mb-3">
                          <h5>Bölge ID</h5>
                          <input
                            onChange={handleChange}
                            name="zoneId"
                            value={zone.zoneId}
                            className="form-control form-control-user"
                            type="text"
                            id="exampleFirstName"
                            placeholder="Bölge ID Gir"
                          />
                        </div>
                        <div className="mb-3">
                          <h5>Bölge Adı</h5>
                          <input
                            onChange={handleChange}
                            name="zoneName"
                            value={zone.zoneName}
                            className="form-control form-control-user"
                            type="text"
                            id="examplePasswordInput"
                            placeholder="Bölge Adı Gir"
                          />
                        </div>
                        <div className="mb-3">
                          <h5>Kullanım Bedeli</h5>
                          <input
                            onChange={handleChange}
                            name="cost"
                            value={zone.cost}
                            className="form-control form-control-user"
                            type="number"
                            id="examplePasswordInput"
                            placeholder="Birim Başı Kullanım Bedeli Gir"
                          />
                        </div>

                        <div className="mb-3">
                          <button
                            onClick={createZone}
                            className="btn btn-primary d-block btn-user w-100"
                            type="submit"
                          >
                            Kaydet
                          </button>
                        </div>
                        <hr />
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default CreateZone;
