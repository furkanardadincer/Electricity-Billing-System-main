import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

function ViewBills() {
  let history = useHistory();

  const [allBills, setAllBills] = useState([]);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("userData");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);

      if (foundUser.user.role === "admin") {
        const config = {
          headers: { Authorization: "Bearer " + foundUser.token }
        };
        axios
          .get("http://localhost:5000/bill/", config)
          .then((res) => {
            setAllBills(res.data.bills);
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

  return (
    <div>
      <Navbar page="View Bill" />
      <div className="container" style={{ paddingTop: "40px" }}>
        <h1>Ödenmemiş Faturalar</h1>
        {allBills.filter((b) => b.status === "Ödenmedi").length < 1 ? (
          <h3>No Bills</h3>
        ) : (
          <div className="table-responsive">
          <table className="table table-hover bg-warning">
            <thead>
              <tr>
                <th scope="col">
                  ID
                </th>
                <th scope="col">
                  Kullanıcı ID
                </th>
                <th scope="col">
                  Bölge
                </th>
                <th scope="col">
                  Ay
                </th>
                <th scope="col">
                  Veriliş tarihi
                </th>
                <th scope="col">
                  Bitiş Tarihi
                </th>
                <th scope="col">
                  Tüketilen Birim
                </th>
                <th scope="col">
                  Toplam Tutar
                </th>
                <th scope="col">
                  Durum
                </th>
              </tr>
            </thead>
        {allBills
          .filter((b) => b.status === "Ödenmedi")
          .map((bill, index) => {
            return (
                  <tbody>
                    <tr className="table-info">
                      <td>
                        <b>{bill._id.substring(0, 8)}</b>
                      </td>
                      <td>
                        <b>{bill.userId}</b>
                      </td>
                      <td>
                        <b>{bill.zoneName}</b>
                      </td>
                      <td>
                        <b>{bill.month}</b>
                      </td>
                      <td>
                        <b>{bill.issueDate}</b>
                      </td>
                      <td>
                        <b>{bill.dueDate}</b>
                      </td>
                      <td>
                        <b>{bill.unitsConsumed}</b>
                      </td>
                      <td>
                        <b>{bill.billAmount}</b>
                      </td>
                      <td>
                        <b>{bill.status}</b>
                      </td>
                    </tr>
                  </tbody>

            );
          })}
          </table>
        </div>
        )
      }
        <h1 style={{ marginTop: "20px" }}>Ödenen Faturalar</h1>
        {allBills.filter((b) => b.status === "Ödendi").length < 1 ? (
          <h3>Fatura Yok</h3>
        ) : (
          <div className="table-responsive">
          <table className="table table-hover bg-warning">
            <thead>
              <tr>
                <th scope="col">
                  ID
                </th>
                <th scope="col">
                  Kullanıcı ID
                </th>
                <th scope="col">
                  Bölge
                </th>
                <th scope="col">
                  Ay
                </th>
                <th scope="col">
                  Veriliş Tarihi
                </th>
                <th scope="col">
                  Bitiş Tarihi
                </th>
                <th scope="col">
                  Ödeme Tarihi
                </th>
                <th scope="col">
                  Tüketilen Birim
                </th>
                <th scope="col">
                  Toplam Tutar
                </th>
                <th scope="col">
                  Durum
                </th>
              </tr>
            </thead>
        {allBills
          .filter((b) => b.status === "Ödendi")
          .map((bill, index) => {
            return (
                  <tbody>
                    <tr className="table-info">
                      <td>
                        <b>{bill._id.substring(0, 8)}</b>
                      </td>
                      <td>
                        <b>{bill.userId}</b>
                      </td>
                      <td>
                        <b>{bill.zoneName}</b>
                      </td>
                      <td>
                        <b>{bill.month}</b>
                      </td>
                      <td>
                        <b>{bill.issueDate}</b>
                      </td>
                      <td>
                        <b>{bill.dueDate}</b>
                      </td>
                      <td>
                        <b>{bill.paymentDate}</b>
                      </td>
                      <td>
                        <b>{bill.unitsConsumed}</b>
                      </td>
                      <td>
                        <b>{bill.billAmount}</b>
                      </td>
                      <td>
                        <b>{bill.status}</b>
                      </td>
                    </tr>
                  </tbody>
            );
          })}
          </table>
        </div>
      )}
      </div>
    </div>
  );
}

export default ViewBills;
