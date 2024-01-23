import React from "react";
import { ReactDOM } from "react-dom/client";
import cat from "../images/mr-whiskerson.png";
import phone_icon from "../images/phone-icon.png";
import mail_icon from "../images/mail-icon.png";

export default function Contact({img,name,phone,mail}) {
    return(
        <div>
            <img src={img}
                alt="cat image"
                className="cat--image" />
            <h2>{name}</h2>
            <div>
                <img src={phone_icon}
                    alt= "phone icon"
                    className="phone--icon" />
                <span>{phone}</span>
            </div>
            <div>
                <img src={mail_icon}
                    alt= "mail icon"
                    className="mail--icon" />
                <span>{mail}</span>
            </div>
        </div>
    )
}