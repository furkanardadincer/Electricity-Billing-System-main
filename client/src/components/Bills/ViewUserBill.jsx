import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import UserNavbar from "../Navbar/UserNavbar";
import StripeCheckout from "react-stripe-checkout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ViewUserBill() {
  let history = useHistory();

  const [allBills, setAllBills] = useState([]);
  const [billId, setBillId] = useState("");
  const [billAmt, setBillAmt] = useState(0);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("userData");

    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      if (foundUser.user.role === "user") {
        const config = {
          headers: { Authorization: "Bearer " + foundUser.token }
        };
        axios
          .get(`http://localhost:5000/bill/user/${foundUser.user.uId}`, config)
          .then((res) => {
            if (res.data.bills.length > 0) {
              setAllBills(res.data.bills);
            } else {
              console.log("A");
            }
          })
          .catch((error) => {
            console.log("B");
            history.push("/login");
          });
      } else {
        console.log("C");
        history.push("/login");
      }
    } else {
      console.log("D");
      history.push("/login");
    }
  }, []);


  async function displayRazorpay(amt, billId, billMonth) {

    var body = {amt: amt};
    axios.post("http://localhost:5000/payment/razorpay", body).then(response => {
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        currency: response.data.currency,
        amount: response.data.amount,
        name: "Electricity Billing System",
        description: "Pay your bills",
        order_id: response.data.id,
        handler: function (res) {
          console.log(res);
          payBill(amt, billId, billMonth);
          toast.success("Ödeme Gerçekleştirildi!", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
          });
          history.push('/userHome');
        },
      };
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    });

  }

  function payBill(billAmt, billId, billMonth){

    const loggedInUser = localStorage.getItem("userData");

    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);

      const config = {
        headers: { Authorization: "Bearer " + foundUser.token }
      };

      if (foundUser.user.role === "user") {

        var future = new Date();
        let date = ("0" + future.getDate()).slice(-2);
        let month = ("0" + (future.getMonth() + 1)).slice(-2);
        let year = future.getFullYear();

        date = date + "-" + month + "-" + year;

        const status = {
          status: "Ödendi",
          paymentDate: date
        };

        const mail = {
          to: foundUser.user.email,
          subject: `Bill Payment Successful!`,
          text: `You have Successfully paid your electricity bill!
Bill Month: ${billMonth}
Bill Amount: ${billAmt}`
        }

        axios.patch(`http://localhost:5000/bill/${billId}`, status, config)
            .then((response) => {
              console.log(response.data);
              axios.get(`http://localhost:5000/bill/user/${foundUser.user.uId}`, config)
                .then((res) => {
                  if (res.data.bills.length > 0) {
                    setAllBills(res.data.bills);
                  } else {
                    console.log("A");
                  }
                })
                .catch((error) => {
                  history.push("/login");
                });
              axios.post("http://localhost:5000/user/sendMail", mail).then((resp) => {
                console.log(resp.data);
              });
            });

          setBillAmt(0);
          setBillId("");
      }
    }
  }

  return (
    <div>
      <UserNavbar page="View Bill" />
      <div style={{ margin: "40px" }}>
        {allBills.filter((b) => b.status !== "Ödendi").length < 1 ? (
          <h1 style={{ textAlign: "center" }}>Faturanız Bulunmamaktadır.</h1>
        ) : (
          <div className="table-responsive">
          <table className="table table-hover bg-warning">
            <thead>
              <tr>
                <th scope="col">
                  ID
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
                  Tüketilen Birim
                </th>
                <th scope="col">
                  Toplam Tutar
                </th>
                <th scope="col">
                  Durum
                </th>
                <th scope="col">
                  İşlem
                </th>
              </tr>
            </thead>
        {allBills.filter((b) => b.status !== "Ödendi").length < 1 ? (
          <h1></h1>
        ) : (
          allBills
            .filter((b) => b.status !== "Ödendi")
            .map((bill, index) => {
              return (
                    <tbody>
                      <tr className="table-info">
                        <td>
                          <b>{bill._id.substring(0, 8)}</b>
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
                        <td>
                          <button
                            style={{
                              marginLeft: "5px",
                              marginRight: "5px",
                              marginBottom: "5px"
                            }}
                            className="btn btn-sm btn-outline-success"
                            onClick={() =>
                              displayRazorpay(bill.billAmount, bill._id, bill.month)
                            }
                          >
                            Ödeme
                          </button>
                        </td>
                      </tr>
                    </tbody>
              );
            })
        )}
      </table>
    </div>
  )}
      </div>
      <ToastContainer />
    </div>
  );
}

export default ViewUserBill;
