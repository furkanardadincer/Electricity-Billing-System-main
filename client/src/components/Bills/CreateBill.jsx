import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CreateBill() {
  let history = useHistory();

  const [month, setMonth] = useState("");
  const [cost, setCost] = useState(0);
  const [zoneName, setZoneName] = useState("");
  const [allZones, setAllZones] = useState([]);
  const [bill, setBill] = useState({
    userId: "",
    zoneName: "",
    unitsConsumed: "",
    billAmount: "",
    month: ""
  });

  const [mail, setMail] = useState({
    to: "",
    subject: "Pay your Bill",
    text: ""
  });

  const [b, setB] = useState(false);

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = yyyy + "/" + mm + "/" + dd;

  function getDueDate(){

    var future = new Date();
    future.setDate(future.getDate() + 30);

    let date = ("0" + future.getDate()).slice(-2);
    let month = ("0" + (future.getMonth() + 1)).slice(-2);
    let year = future.getFullYear();
    let hours = future.getHours();
    let minutes = future.getMinutes();

    date = date + "-" + month + "-" + year;
    return date;
  }

  useEffect(() => {
    const loggedInUser = localStorage.getItem("userData");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      if (foundUser.user.role === "admin") {
        const config = {
          headers: { Authorization: "Bearer " + foundUser.token }
        };

        axios
          .get("http://localhost:5000/zone/", config)
          .then((res) => {
            setAllZones(res.data.zones);
          })
          .catch((error) => {
            history.push("/login");
          });
      } else {
        history.push("/login");
      }
    } else {
      history.push("/login");
    }
  }, []);

  function updateZone(event) {
    const value = event.target.value;
    if (value === "select") {
      setZoneName("");
    } else {
      setZoneName(value);
      const loggedInUser = localStorage.getItem("userData");
      if (loggedInUser) {
        const foundUser = JSON.parse(loggedInUser);
        if (foundUser.user.role === "admin") {
          const config = {
            headers: { Authorization: "Bearer " + foundUser.token }
          };
          axios
            .get(`http://localhost:5000/zone/name/${value}`, config)
            .then((res) => {
              setCost(res.data.zone[0].cost);
            })
            .catch((error) => {
              history.push("/login");
            });
        } else {
          history.push("/login");
        }
      } else {
        history.push("/login");
      }
    }
  }

  function updateMonth(event) {
    const value = event.target.value;
    if (value === "select") {
      setMonth("");
    } else {
      setMonth(value);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    if(name==="userId"){
      const loggedInUser = localStorage.getItem("userData");
      if (loggedInUser) {
        const foundUser = JSON.parse(loggedInUser);
        if (foundUser.user.role === "admin") {
          const config = {
            headers: { Authorization: "Bearer " + foundUser.token }
          };
          axios
            .get(`http://localhost:5000/user/id/${value}`, config)
            .then((res) => {
              console.log(res.data)
              setMail((preValues) => {
                return {
                  ...preValues,
                  to: res.data.user[0].email
                };
              });
            })
            .catch((error) => {
              history.push("/login");
            });
        }
      }
    }
    setBill((preValues) => {
      return {
        ...preValues,
        [name]: value
      };
    });
  }

  function calculateBill(e) {
    e.preventDefault();
    console.log(cost);
    console.log(bill.unitsConsumed);
    var amt = bill.unitsConsumed * cost;
    setBill((preValues) => {
      return {
        ...preValues,
        billAmount: amt,
        month: month,
        zoneName: zoneName
      };
    });
    setB(true);
    setMail((preValues) => {
      return {
        ...preValues,
        text: `Fatura Ay??: ${month}
        Fatura Tutar??: ${amt}
        Biti?? Tarihi: ${getDueDate()}`
      };
    });
  }

  function createBill(e) {
    e.preventDefault();
    const loggedInUser = localStorage.getItem("userData");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      if (foundUser.user.role === "admin") {
        const config = {
          headers: { Authorization: "Bearer " + foundUser.token }
        };
        axios.post("http://localhost:5000/user/sendMail", mail).then((response) => {
          console.log(response.data);
        });
        axios
          .post("http://localhost:5000/bill/", bill, config)
          .then((response) => {
            toast.success("Fatura Ba??ar??yla Olu??turuldu!", {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined
            });
            console.log(response);
          });
        setBill({
          userId: "",
          zoneName: "",
          unitsConsumed: "",
          billAmount: "",
          month: ""
        });
      } else {
        history.push("/login");
      }
    } else {
      history.push("/login");
    }
  }

  return (
    <div>
      <Navbar page="Create Bill" />
      <div className="container">
        <h1
          className="text-dark"
          style={{ fontSize: "75px", textAlign: "center", marginTop: "5rem" }}
        >
          Fatura Olu??tur
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
                          <h5>Kullan??c?? ID</h5>
                          <input
                            onChange={handleChange}
                            name="userId"
                            value={bill.userId}
                            className="form-control form-control-user"
                            type="text"
                            id="exampleFirstName"
                            placeholder="Kullan??c?? ID Gir"
                          />
                        </div>
                        <div className="mb-3">
                          <h5>B??lge</h5>
                          <div className="mb-3">
                            <select
                              onChange={updateZone}
                              value={zoneName}
                              className="form-control"
                            >
                              <option value="select">Se??</option>
                              {allZones.map((zone, index) => {
                                return <option>{zone.zoneName}</option>;
                              })}
                            </select>
                          </div>
                        </div>
                        <div className="mb-3">
                          <h5>T??ketilen Birim </h5>
                          <input
                            onChange={handleChange}
                            name="unitsConsumed"
                            value={bill.unitsConsumed}
                            className="form-control form-control-user"
                            type="number"
                            id="examplePasswordInput"
                            placeholder="T??ketilen Birimi Gir"
                          />
                        </div>
                        <div className="mb-3">
                          <h5>Ay</h5>
                          <div className="mb-3">
                            <select
                              onChange={updateMonth}
                              value={month}
                              className="form-control"
                            >
                              <option value="default">Se??</option>
                              <option value="Ocak">Ocak</option>
                              <option value="??ubat">??ubat</option>
                              <option value="Mart">Mart</option>
                              <option value="Nisan">Nisan</option>
                              <option value="May??s">May??s</option>
                              <option value="Haziran">Haziran</option>
                              <option value="Temmuz">Temmuz</option>
                              <option value="A??ustos">A??ustos</option>
                              <option value="Eyl??l">Eyl??l</option>
                              <option value="Ekim">Ekim</option>
                              <option value="Kas??m">Kas??m</option>
                              <option value="Aral??k">Aral??k</option>
                            </select>
                          </div>
                        </div>
                        {b && (
                          <div className="mb-3">
                            <h5>Toplam Tutar</h5>
                            <p>{bill.billAmount}</p>
                          </div>
                        )}
                        <button
                          style={{ marginBottom: "10px" }}
                          onClick={calculateBill}
                          className="btn btn-success d-block btn-user w-100"
                          type="submit"
                        >
                          Fatura Hesapla
                        </button>
                        <button
                          onClick={createBill}
                          className="btn btn-primary d-block btn-user w-100"
                          type="submit"
                        >
                          Fatura Olu??tur
                        </button>
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

export default CreateBill;
