import React from "react";
import { ReactDOM } from "react";
import "./Places.css";

export default function Spot(props) {
    return(
         <div className="spot">
            <h1>{props.name}</h1>
            <p>
                {props.division}
            </p>
            <p>
                {props.blog_description}
            </p>
         </div>
    )
}