import React from "react";
import { ReactDOM } from "react";


export default function Joke(props) {
    //const colors = ["Red", "Orange", "Yellow", "Green", "Blue", "Indigo", "Violet"]
    return (
        <div>
            {props.setup && <h3>Setup: {props.setup}</h3>}
            <p>{props.punchline}</p>
            <hr/>
            {/* {colors.map((x) => {
                return <h1>{x}</h1>;
            })} */}


        </div>
    )
}