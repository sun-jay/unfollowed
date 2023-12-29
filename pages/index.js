import React, { useEffect } from 'react'
import { useState } from 'react'
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";
import LoadingDots from "../components/LoadingDots";
import BG from '../components/BG';
import RandomButton from '../components/RandomButton';
import Card from '../components/Card';
import Dropzone from '../components/Dropzone';
import { Toaster, toast } from "react-hot-toast";


const Index = () => {
    const [inp, setInp] = useState("")
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [res, setRes] = useState(false)
    const [output, setOutput] = useState("")
    const [loading, setLoading] = useState(false)
    const [numswitch, setNumswitch] = useState(0)
    const [usedNums, setUsedNums] = useState(new Set([]))
    const [infoUp, setInfoUp] = useState(false)
    const [links, setLinks] = useState([])

    const [columnsCount, setColumnsCount] = useState(3);
    const [columns, setColumns] = useState([]);
    const [maxItemsPerColumn, setMaxItemsPerColumn] = useState(0);

    useEffect(() => {
        const maxItemsPerColumn = Math.ceil(links.length / columnsCount);

        const newColumns = [];
        for (let i = 0; i < links.length; i += maxItemsPerColumn) {
            newColumns.push(links.slice(i, i + maxItemsPerColumn));
        }

        setColumns(newColumns);
        setMaxItemsPerColumn(maxItemsPerColumn);
    }, [links, columnsCount]);


    // handle_search = () => {
    //     str = 'https://api.srvusd.net/semantic_search?query='
    //     setRes(str.repeat(10))
    // }

    const search = async (query) => {

        // if quety is too long, alert user and return
        if (query.length > 300) {
            alert('Query too long')
            return
        }

        setLoading(true)
        const res = await fetch("/api/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query: query }),
        });
        setOutput(await res.json())
        setLoading(false)
    };
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseEnter = () => {
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
    };

    const random_switch = () => {
        setIsHovering(true);
        setTimeout(() => {
            setIsHovering(false);
        }, 500);
    };

    // get a random float between 1.5 and 2.5
    const randomFloat = (min, max) => {
        if (numswitch > 5) {
            console.log('rando')

            return Math.random() * (max - min) + min;
        } else {
            console.log('random float')
            return Math.random() * ((max + 10) - min) + min;
        }
    };
    useEffect(() => {
        // call random switch every 5 seconds
        const interval = setInterval(() => {
            random_switch();
        }, randomFloat(1, 2) * 1000);
        return () => clearInterval(interval);
    }, []);

    const random_prompts = [
        'who made teslas',
        'plastic cups',
        "What was Beethoven's favorite food",
        'Nvidia GeForce RTX 3090',
        'Indian Food',
        'Internal Combustion Engine',
        "Fighting among friends",
        'george washington',
        "I forgot to pay my taxes",
        "Biggie Smalls",
        "Drake",
        "Honey Bees",
        "Driving my spaceship into the sun",
        'Fortnite battle royale',
        'Warhammer 40k',
        'Taylor Swift',
        'JavaScript',
        'new red pen',
        'magic wand',
        'Youtube',
        'Britain and Zanzibar',
        'Pareidolia',
        "Schrödinger's cat"
    ]
    const get_random_prompt = () => {
        let unusedIndexes = random_prompts.map((val, ind) => ind).filter((val) => !usedNums.has(val));

        // If all indexes have been used, reset the set of used indexes
        if (unusedIndexes.length === 0) {
            setUsedNums(new Set([]));
            unusedIndexes = random_prompts.map((val, ind) => ind);
        }

        // Choose a random index from the unused indexes
        const randomIndex = unusedIndexes[Math.floor(Math.random() * unusedIndexes.length)];

        // Add the index to the set of used indexes
        setUsedNums(usedNums.add(randomIndex));

        // Return the random prompt
        return random_prompts[randomIndex];
    }
    const handleKeyDown = (event) => {
        if (event.keyCode === 13) {
            // The Enter key was pressed, so submit the input
            search(inp).then(() => {
                setRes(true)
            }
            )
        }
    }

    const copyToClipboard = () => {
        // join all links with a new line into a single string
        var content = links.map((item, index) => (
            `${item} , \n`
        )).join('')

        navigator.clipboard.writeText(content);
        toast.success("Copied to clipboard!")
    };


    return (
        <div>
            <Toaster
                position="top-center"
                reverseOrder={false}
                toastOptions={{ duration: 4000 }}
            />
            <div className={!res ? 'text-white flex flex-col items-center justify-center w-screen h-screen' : 'flex flex-col text-white items-center justify-center w-screen h-full'}    >
                <BG />
                <AnimatePresence>
                    {JSON.stringify(uploadedFiles) == '[]' && (
                        <motion.div
                            transition={!res ? { duration: 2 } : { duration: 0.5 }}
                            initial={{ y: "-100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "-2500%" }}
                            className='flex md:hidden flex-col absolute items-center justify-center top-[4%]'
                        >
                            <div onClick={() => setInfoUp(!infoUp)} className='w-11/12 md:w-8/12 text-center flex flex-col items-center justify-center rounded-xl p-4 bg_white'>
                                {!infoUp ? (<h1 className="w-full mb-3 text-xl md:text-3xl font-bold ">
                                    How does this work?

                                </h1>) :
                                    (<h1 className=" md:block text-md md:text-sm text-center w-12/12 mb-3 ">
                                        Instagram is required by law (in California) to offer downloads of personal data to users. This includes all of the user's followers and all of the user's following. Simply request a data download from in the instagram app (select HTML format takes about 10 minutes to email). Download the data and upload the contents of the 'followers_and_following' folder. WE DO NOT COLLECT ANY DATA. All the computation is done in the browser using JavaScript. In fact, the website could function perfectly offline, but you need an internet connection to get the website code.code.
                                    </h1>)}
                            </div>
                        </motion.div>)}
                    {JSON.stringify(uploadedFiles) == '[]' && (
                        <motion.div
                            transition={!res ? { duration: 2 } : { duration: 0.5 }}
                            initial={{ y: "-100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "-2500%" }}
                            className='hidden md:flex flex-col absolute items-center justify-center top-[4%]'
                        >
                            <div className='w-11/12 md:w-8/12 text-center flex flex-col items-center justify-center rounded-xl p-4 bg_white'>
                                <h1 className="w-full mb-3 text-xl md:text-3xl font-bold ">
                                    How does this work?
                                </h1>
                                <h1 className=" hidden md:block text-xs md:text-sm text-center w-12/12 mb-3 ">
                                Instagram is required by law (in California) to offer downloads of personal data to users. This includes all of the user's followers and all of the user's following. Simply request a data download from in the instagram app (select HTML format, takes about 10 minutes to email). Download the data and upload the contents of the 'followers_and_following' folder. WE DO NOT COLLECT ANY DATA. All the computation is done in the browser using JavaScript. In fact, the website could function perfectly offline, but you need an internet connection to get the website code.
                                </h1>
                            </div>
                        </motion.div>)}




                </AnimatePresence>

                <motion.div layout transition={{ duration: 0.5 }} >
                    <motion.div>
                        <div className='mt-10 flex flex-col items-center justify-center w-full'>
                            <h1 className="text-5xl md:text-6xl text-center mb-3 font-bold  rounded-xl p-4 bg_white">

                                <span className='flicker'>UNFOLLOWED</span>
                                :{" "} An Instagam App

                                {/* {props.user ? <div>user :{props.user.displayName}</div> : null}
                                                  <div>user :{ JSON.stringify(props.FBuser.requests?.map((r:any)=> r.Res)) }</div> */}
                                <div className="pt-1 text-sm">A <span class="underline"><a rel="noopener noreferrer" target="_blank" href="https://www.sunny-jay.com/">Sunny Jayaram</a></span> Production</div>
                            </h1>
                            {/* this div will ve a horizontal flex box */}
                            {/* desktop */}
                            <div className="hidden mb-4 md:flex flex-row items-center justify-center w-full h-1/12">


                                {!res && (
                                    <motion.div
                                        transition={{ duration: 0.5 }}
                                        initial={{ y: "100%" }}
                                        animate={{ y: 0 }}
                                        exit={{ y: "100%" }}
                                        className=''
                                    >
                                        <Dropzone uploadedFiles={uploadedFiles}
                                            setUploadedFiles={setUploadedFiles}
                                            search={search} res={res} setRes={setRes}
                                            links={links} setLinks={setLinks} />
                                    </motion.div>
                                )}

                            </div>
                            {/* desktop */}
                            <div className="md:hidden mb-4 flex flex-col items-center justify-center w-full h-1/12">
                                {/* mobile */}
                                {!res && (
                                    <motion.div
                                        transition={{ duration: 0.5 }}
                                        initial={{ y: "100%" }}
                                        animate={{ y: 0 }}
                                        exit={{ y: "100%" }}
                                        className=''
                                    >
                                        <Dropzone uploadedFiles={uploadedFiles}
                                            setUploadedFiles={setUploadedFiles}
                                            search={search} res={res} setRes={setRes}
                                            links={links} setLinks={setLinks} />
                                    </motion.div>
                                )}
                            </div>
                            {/* mobile */}




                        </div>
                    </motion.div>
                </motion.div >
                <div className=''>
                    {res && (
                        <motion.div
                            transition={{ duration: 0.5 }}
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            className=''
                        >
                            <div className='flex flex-col items-center justify-center bg_white p-4'>
                                <div class="flex flex-col justify-center items-center">
                                    <div className='pb-2 md:text-3xl text-lg'> Everyone Who Doesnt Follow You Back:</div>
                                    <button className='special_button grow hover' onClick={copyToClipboard}>Copy Links To Clipboard</button>
                                </div>
                                {/* {output.map((item, index) => (
                                    <Card name={item.metadata.name} desc={item.metadata.desc} grades={item.metadata.grades}
                                        school={item.metadata.school} score={item.score} key={index}
                                    />
                                ))} */}
                                {/* {JSON.stringify(output)} */}


                                <div className="hidden md:flex flex-row justify-center ">
                                    {columns.map((column, colIndex) => (
                                        <div key={colIndex} className="flex flex-col items-center justify-center mx-4">
                                            {column.map((item, index) => (
                                                <div key={index}>
                                                    {`${colIndex * maxItemsPerColumn + index + 1}. `}
                                                    <a className='underline' href={item} target="_blank" rel="noopener noreferrer">
                                                        {item}
                                                    </a>
                                                    <br />
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>

                                <div className="flex md:hidden flex-col justify-center text-sm pl-4 ">
                                    {
                                        links.map((item, index) => (
                                            <div key={index}>
                                                {`${index + 1}. `}
                                                <a className='underline' href={item} target="_blank" rel="noopener noreferrer">
                                                    {item}
                                                </a>
                                                <br />
                                            </div>
                                        ))
                                    }
                                </div>




                            </div>
                        </motion.div>
                    )}
                </div>
                {/* <div className=' invisible w-6/12 text-center flex flex-col items-center justify-center rounded-xl p-4 bg_white'>
                    <h1 className="sm:text-3xl text-4xl mb-3 font-bold ">
                        What is a Semantic Search Engine?
                    </h1>

                    <h1 className="sm:text-xl text-4xl mb-3 ">
                        A semantic search engine is a search engine that uses semantic analysis to understand the meaning of the words in a query and the meaning of the words in the documents it indexes.
                    </h1>

                </div> */}
            </div>
        </div>

    )
}

export default Index
