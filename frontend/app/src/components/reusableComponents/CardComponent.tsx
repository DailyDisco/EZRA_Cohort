import { JSX } from "react";
import Card from "antd/es/card/Card";

interface CardComponentProps {
    title: string;
    description: string;
    icon?: JSX.Element;
    button?: JSX.Element;
    hoverable: boolean;
    value?: number;
}

export const CardComponent = (props: CardComponentProps) => {
    return (
        <>
            <Card
                title={
                    <>
                        <div className="flex flex-column align-items-center text-center">
                            <div
                                className="mb-3 pulse-on-hover"
                                style={{ fontSize: "2.5rem", color: "#00674f" }}>
                                {props.icon}
                            </div>
                            <h5
                                className="mb-0"
                                style={{ fontWeight: "600", color: "#1e293b" }}>
                                {props.title}
                            </h5>
                        </div>
                    </>
                }
                hoverable={props.hoverable}
                className="card pb-2"
                actions={[props.button]}
                style={{ border: "none", boxShadow: "var(--shadow-sm)" }}
                styles={{ body: { padding: "1.5rem" } }}>
                <div className="flex flex-column text-center">
                    {props.value && (
                        <span
                            className="mb-3"
                            style={{ fontSize: "2rem", fontWeight: "700", color: "#00674f" }}>
                            {props.value}
                        </span>
                    )}
                    {props.description && <span style={{ color: "#64748b", lineHeight: "1.6", fontSize: "0.95rem" }}>{props.description}</span>}
                </div>
            </Card>
        </>
    );
};
