  import React, { useEffect, useState } from "react";
  import { useNavigate, useParams } from "react-router-dom";
  import axios from "axios";
  import "./TransactionReceipt.css";


  /* ================= WHATSAPP FLOAT ================= */

  const WhatsAppFloat = ({
    phoneNumber = "15485825756",
    message = "Hello support, I need help with my transaction.",
  }) => {

    const formattedNumber = phoneNumber.replace(/[^\d]/g, "");

    const url =
      `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`;

    return (

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
      >

        <svg width="28" height="28" viewBox="0 0 24 24" fill="white">

          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />

        </svg>

      </a>

    );

  };


  /* ================= MAIN ================= */

  export default function TransactionReceipt() {

    const navigate = useNavigate();

    const { id } = useParams();


    const [tx, setTx] = useState(null);

    const [loading, setLoading] = useState(true);

    const [copied, setCopied] = useState("");



    const copy = (text, type) => {

      if (!text) return;

      navigator.clipboard.writeText(text);

      setCopied(type);

      setTimeout(() => setCopied(""), 1200);

    };



    /* ================= NETWORK ================= */

    const getNetwork = (asset = "") =>

      ({

        btc: "BTC",

        eth: "ERC20",

        bnb: "BEP20",

        trx: "TRC20",

        sol: "SOL",

        xrp: "XRP",

        doge: "DOGE",

        ltc: "LTC",

        usdttron: "TRC20",

        usdtbnb: "BEP20",

      }[asset.toLowerCase()] || "Unknown");



    /* ================= DISPLAY COIN ================= */

   const getDisplayCoin = (asset) => {
  if (asset === "usdtTron") return "USDT";
  if (asset === "usdtBnb") return "USDT";
  return asset.toUpperCase();
};

    /* ================= FETCH ================= */

    useEffect(() => {

      const fetchTx = async () => {

        try {

          const token = localStorage.getItem("token");

          if (!token) return navigate("/login");



          const res = await axios.get(

            `https://backend-instacoinpay-1.onrender.com/api/transfer/${id}`,

            {

              headers: {

                Authorization: `Bearer ${token}`,

              },

            }

          );



          const raw = res.data.data;



          const transaction = {

            _id:

              raw.transactionId ||

              raw.transferId ||

              raw._id,



            asset: raw.asset,



            amount: raw.amount,



            status:

              (raw.status ||

                raw.transferStatus ||

                "pending").toLowerCase(),



            toAddress: raw.toAddress,



            networkFee: raw.networkFee ?? 0,



            createdAt: raw.createdAt,



            completedAt: raw.completedAt,

          };



          setTx(transaction);

        }

        catch {

          setTx(null);

        }

        finally {

          setLoading(false);

        }

      };



      fetchTx();

    }, [id, navigate]);



    /* ================= LOADING ================= */

    if (loading)

      return (

        <div className="instacoinx-receipt-page">

          Loading...

        </div>

      );



    if (!tx)

      return (

        <div className="instacoinx-receipt-page">

          Transaction not found

        </div>

      );



    /* ================= VALUES ================= */

    const amount = Number(tx.amount ?? 0);

    const coin = getDisplayCoin(tx.asset);

    const fee = tx.networkFee ?? 0;



    const formattedDate =

      tx.completedAt || tx.createdAt

        ? new Date(

            tx.completedAt ||

            tx.createdAt

          ).toLocaleDateString("en-US", {

            day: "2-digit",

            month: "short",

            year: "numeric",

          })

        : "--";



    /* ================= STATUS ================= */

    const status = tx.status;



    /* ================= STATUS MESSAGE ================= */

    const getMessage = () => {

      if (status === "completed")

        return "Your crypto transfer has been completed successfully.";



      if (status === "failed")

        return "Your transaction failed. Please contact support.";



      return "Your transaction is pending confirmation.";

    };



    /* ================= UI ================= */

    return (

      <>

        <div className="instacoinx-receipt-page">

          <div className="receipt-card">



            <div className="title">

              Withdrawal Details

            </div>



            <div className="amount">

              {amount} {coin}

            </div>



            {/* STATUS */}

            <div className={`status-wrapper ${status}`}>



              {

                ["pending",

                "pending_otp",

                "processing"]

                .includes(status)

                &&

                <div className="loader" />

              }



              {

                status === "completed"

                &&

                <div className="status-icon success">

                  ✔

                </div>

              }



              {

                status === "failed"

                &&

                <div className="status-icon failed">

                  ✖

                </div>

              }



              <div className="status-text">

                {

                  status === "completed"

                    ? "Successful"

                    : status === "failed"

                    ? "Failed"

                    : "Pending"

                }

              </div>



            </div>



            {/* STATUS MESSAGE */}

            <div className="receipt-info">

              {getMessage()}

            </div>



            <div className="divider" />



            <div className="row">

              Network

              <strong>

                {getNetwork(tx.asset)}

              </strong>

            </div>



            <div className="row">

              Address

              <strong>

                {tx.toAddress}

                <button onClick={() => copy(tx.toAddress, "address")}>

                  📋

                </button>

              </strong>

            </div>



            <div className="row">

              TxID

              <strong>

                {tx._id}

                <button onClick={() => copy(tx._id, "txid")}>

                  📋

                </button>

              </strong>

            </div>



            <div className="row">

              Amount

              <strong>

                {amount} {coin}

              </strong>

            </div>



            <div className="row">

              Network Fee

              <strong>

                {fee} {coin}

              </strong>

            </div>



            <div className="row">

              Date

              <strong>

                {formattedDate}

              </strong>

            </div>



            <button

              className="dashboard-transaction-receipt-btn"

              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </button>



          </div>

        </div>



        <WhatsAppFloat

          message={`Hello support, I need help with my ${coin} transaction (${tx._id})`}

        />

      </>

    );

  }
