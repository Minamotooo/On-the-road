import React, { useState } from "react";
import BussinessSignin from "./BussinessSignin";
import AdminSignin from "./AdminSignin";
import ClientSignin from "./ClientSignin";
import "./in&up.css";

export default function Entity({onClose}) {

const [ClientModal,setClientModal] = useState(false);
const [BussinessModal,setBussinessModal] = useState(false);
const [AdminModal,setAdminModal] = useState(false);


const openClientModal = () => setClientModal(true);
const openBussinessModal = () => setBussinessModal(true);
const openAdminModal = () => setAdminModal(true);

    return (
        <>
            <div className="modal-wrapper"></div>
            <div className="modal-container">

            <div>
                <h1 className="header">Avail our services as </h1>
                <button type="button" className="close-button" onClick={onClose}>&times;</button>
            </div>

            <div>
                <button className="button--style" onClick={openClientModal}>Client</button>
                <button className="button--style" onClick={openBussinessModal}>Bussiness</button>
                <button className="button--style" onClick={openAdminModal}>Admin</button>
            </div>
            {ClientModal && <ClientSignin onClose={onClose} />}
            {BussinessModal && <BussinessSignin onClose={onClose} />}
            {AdminModal && <AdminSignin onClose={onClose} />}
            </div>
        </>
    )
}