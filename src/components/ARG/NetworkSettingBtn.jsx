import React from "react";

const NetworkSettingBtn = (props) => {
    return (
        <div
            style={{
                position: "absolute",
                bottom: "16px",
                right: "16px",
                boxSizing: "border-box",
                fontSize: "32px",
                cursor: "pointer",
            }}
            onClick={props.onClick}
        >
            ⚙
        </div>
    );
};

export default NetworkSettingBtn;
