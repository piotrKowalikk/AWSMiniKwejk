import * as React from "react";
import { connect } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Button } from "react-bootstrap";
interface ICreatePost extends RouteComponentProps {
    store: any;
}
const CreatePost: React.FC<ICreatePost> = (props: ICreatePost) => {
    const styleCard: React.CSSProperties = {
        borderStyle: "groove",
        marginTop: 5,
        "maxWidth": "45vw",
        backgroundColor: "#26292d",
        minHeight: "20vh",
        color: "white",
        paddingLeft: "100px",
        paddingTop: 30,
        paddingBottom: 30,
        paddingRight: 100
    };
    let fileInput = React.useRef();
    let submitButton = React.useRef();

    const [error, setError] = React.useState<string>("");
    const [title, setTitle] = React.useState<string>("");
    const [fileName, setFileName] = React.useState<string>("");
    const [fileContent, setFileContent] = React.useState<any>("");
    const [isLoading, setLoading] = React.useState<boolean>(false);

    const onCreate = async () => {
        setLoading(true);
        try {
            fetch("https://vppporgbhg.execute-api.us-east-1.amazonaws.com/Prod/CreatePost", {
                method: 'POST',
                headers: {
                    "Authorization": props.store.cognito.user.signInUserSession.idToken.jwtToken
                },
                body: JSON.stringify({
                    "Author": props.store.cognito.user.username,
                    "Title": title,
                    "Filename": (fileInput.current as any).files[0].name,
                    "ContentData": fileContent
                })
            }).then(data => {
                props.history.push("/posts");
            }).catch((error) => {
                console.error('Error:', error);
                setLoading(false);
                setError("Something went wrong!");
            });
        }
        catch (e) {
            setError("Something went wrong!");
            setLoading(false);
        }
    }

    return (
        <div className="row">
            <div className="col-md-3"></div>
            <div className="col-md-6" style={styleCard}>
                {error != "" &&
                    <div>
                        <label style={{ fontSize: 20, color: "red" }} >{error}</label>
                    </div>
                }<div>
                    <label style={{ fontSize: 20 }} >Create post </label>
                </div>
                <div className="custom-file input-group">
                    <input required type="file" accept="image/*" onChange={(events) => {
                        let fileReader: FileReader = new FileReader();
                        fileReader.onloadend = function (file) {
                            setFileContent((file.currentTarget as any).result);
                        };
                        fileReader.readAsDataURL((fileInput.current as any).files[0]);
                        if (fileInput.current && (fileInput.current as any).files && (fileInput.current as any).files.length > 0) {
                            setFileName((fileInput.current as any).files[0].name);
                        }
                    }} className="custom-file-input" id="customFile" ref={fileInput} />
                    <label className="custom-file-label" htmlFor="customFile">
                        Choose image
                        </label>
                    <label>
                        {fileName}
                    </label>
                </div>
                <div className="mb-2 mt-2">
                    <input type="text" className="form-control" placeholder="Your title" required onChange={(event => { console.log(title); setTitle(event.target.value) })} />
                </div>
                <Button disabled={isLoading} className="btn btn-success" onClick={onCreate}>
                    {isLoading &&
                        <div style={{ marginLeft: (-1) * (submitButton.current ? (submitButton as any).current.offsetWidth / 2 + 6 : 0) }} className="spinner-border spinner-border-sm" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    }Upload!</Button>
            </div>
            <div className="col-md-3"></div>
        </div>);
}

const mapStateToProps = (store) => {
    return {
        store
    }
}

export default connect(mapStateToProps, null)(withRouter(CreatePost))