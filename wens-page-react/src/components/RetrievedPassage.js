import { TextField, Box, Button, Typography, TableContainer, Table, TableBody, TableHead, TableCell, TableRow } from "@mui/material";
import { useEffect, useState } from "react";
import Highlighter from "react-highlight-words";

function RetrievedPassage( {passageObj} ) {

    const [ color, setColor ] = useState("red");
    const [ repeatedWords, setRepeatedWords ] = useState([]);

    const wordsToExclude = ["the", "is", "are", "was", "were", "to", "me", "in", "of", "a", "and"]

    const boldText = ({ children, highlightIndex }) => (
        <strong className="highlighted-text">{children}</strong>
    );

    const italicizeText = ({ children, highlightIndex }) => (
        <em className="highlighted-text">{children}</em>
    );

    const colorText = ({ children, highlightIndex }) => (
        <Typography component="span" sx={{bgcolor:`${color}`, color:"white"}} variant="subtitle1">{children}</Typography>
    )

    const [ searchWords, setSearchWords ] = useState([]);

    const generateFrequency = (passage) => {
        const wordSet = new Set();
        const wordArr = passage.text.replaceAll("\n", " ").replaceAll("? ", " ").replaceAll(". ", " ").replaceAll(", ", " ").split(" ");
        const wordCount = [];
        console.log(wordArr);
        wordArr.forEach(word => {
            wordSet.add(word.toLowerCase());
        });
        wordSet.forEach((word)=> {
            wordCount.push(
                {
                    word: word,
                    count: wordArr.filter((val)=> (val.toLowerCase() === word)).length
                }
            )
        })
        setRepeatedWords(wordCount.sort((word1, word2)=> {return -(word1.count - word2.count)}));
    }

    useEffect(()=> {
        generateFrequency(passageObj);
    })

    return (
        <Box sx={{border: "1px solid black", borderRadius: 3, p:5, m:3, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "1200px" }}> 
            <Box sx={{ lineHeight: 3 }}> 
                <Highlighter
                    highlightClassName="YourHighlightClass"
                    searchWords={searchWords.map((word)=>word.trim())}
                    autoEscape={true}
                    highlightTag={colorText}
                    textToHighlight={passageObj.text}
                    />
            </Box>
            {passageObj.reference}
            <TextField sx={{m: 2}}label="Search words" size="small" onChange={(event)=>setSearchWords(event.target.value.split(","))}></TextField>
            <TextField label="Color" size="small" onChange={(event)=>setColor(event.target.value)}></TextField>
            <TableContainer sx={{ width: "400px" }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center"><strong>Repeated Words</strong></TableCell>
                            <TableCell align="center"><strong>Count</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {repeatedWords.filter((word)=> (!wordsToExclude.includes(word.word))).slice(0, 20).map((word, key)=> {
                            return (
                                <TableRow>
                                    <TableCell align="center">{word.count}</TableCell>
                                    <TableCell align="center">{word.word}</TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            
        </Box>
    )
}

export default RetrievedPassage;