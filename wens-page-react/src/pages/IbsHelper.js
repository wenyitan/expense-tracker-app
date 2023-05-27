import { TextField, Box, Button } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import RetrievedPassage from "../components/RetrievedPassage";

function IbsHelper() {

    const [ passage, setPassage ] = useState("");
    const [ inputPassage, setInputPassage ] = useState("");
    const [ isRetrieved, setIsRetrieved ] = useState(false);
    const [ block, setBlock ] = useState(1);

    const getPassage = () => {
        axios.get(`https://bible-api.com/${inputPassage}`)
            .then((response) => {
                console.log(response.data);
                setPassage(response.data);
                setIsRetrieved(true);
            })
            .catch((err)=> {
                console.log(err);
            })
    }

    const Highlight = ({ children, highlightIndex }) => (
        <strong className="highlighted-text">{children}</strong>
      );

    var arr = Array.from('G'.repeat(block));

    const increment = () => {
        setBlock(block + 1);
    }

    const decrement = () => {
        if (block != 1) {
            setBlock(block - 1);
        }
    }

    return (
        <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
            IBS Helper
            <TextField sx={{marginTop: 2}} size="small" label="Verse reference" helperText="Verse reference here" onChange={(event)=>setInputPassage(event.target.value)}></TextField>
            <Button sx={{marginTop: 2}} onClick={getPassage} variant="outlined">Analyze</Button>
            <Box sx={{display:"flex", flexDirection: "row"}}>
                <Button sx={{marginTop: 2}} onClick={increment} variant="outlined">+</Button>
                <Button sx={{marginTop: 2}} onClick={decrement} variant="outlined">-</Button>
            </Box>
            <Box sx={{display: "flex", flexDirection: "row", flexWrap:"wrap", alignItems: "center", justifyContent: "center"}}>
                {arr.map((val, key)=> {
                    return (
                        isRetrieved && <RetrievedPassage passageObj={passage} />
                    )
                })}
            </Box>
            
        </Box>
    )
}

export default IbsHelper;