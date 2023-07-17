import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Toaster, toast } from "react-hot-toast";


const TextFileUploader = ({ uploadedFiles, setUploadedFiles, res, setRes, links, setLinks }) => {
    // const [uploadedFiles, setUploadedFiles] = useState([]);
    const [correctFilesUploaded, setCorrectFilesUploaded] = useState(false);

    const getFileContent = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = function (e) {
                resolve(e.target.result);
            };

            reader.onerror = function (e) {
                reject(new Error('Error reading the file.'));
            };

            reader.readAsText(file);
        });
    };

    const onDrop = async (acceptedFiles) => {
        const newFiles = await Promise.all(
            acceptedFiles.map(async (file) => ({
                fileName: file.name,
                fileContent: await getFileContent(file),
                fileType: file.type,
            }))
        );

        setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles]);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'text/plain',
        multiple: true,
    });

    const test_uploaded_files = () => {
        var file1 = false
        var file2 = false

        for (var file of uploadedFiles) {
            // check if the word 'following' is in the file
            if (file.fileName?.includes("following") && file.fileName.includes(".html")) {
                file1 = true;
            }
            if (file.fileName?.includes("followers") && file.fileName.includes(".html")) {
                file2 = true;
            }
        }
        if (file1 && file2) {
            setCorrectFilesUploaded(true);
        } else {
            toast.error("Please upload followers.html and following.html");
        }
    }

    useEffect(() => {
        if (uploadedFiles.length > 0) {
            test_uploaded_files();
        }
    }, [uploadedFiles]);

    useEffect(() => {
        if (correctFilesUploaded) {
            toast.success("Correct files uploaded");
        }
    }, [correctFilesUploaded]);

    const handle_analysis = () => {

        const parse = (dummy) => {
            var links = new Set();
            var divs = dummy.getElementsByClassName('pam _3-95 _2ph- _a6-g uiBoxWhite noborder');
            for (var div of divs) {
                var link = div.getElementsByClassName('_a6-p')[0].getElementsByTagName('a')[0].getAttribute('href');
                links.add(link);
            }
            return links;
        }

        var following_html = null
        var followers_html = null

        try {

            for (var file of uploadedFiles) {
                // check if the word 'following' is in the file
                if (file.fileName?.includes("following") && file.fileName.includes(".html")) {
                    following_html = file.fileContent
                }
                if (file.fileName?.includes("followers") && file.fileName.includes(".html")) {
                    followers_html = file.fileContent
                }
            }

            console.log(following_html)

            const parser1 = new DOMParser();
            const parser2 = new DOMParser();

            var dummy1 = parser1.parseFromString(following_html, "text/html");
            var dummy2 = parser2.parseFromString(followers_html, "text/html");

            var following_links = parse(dummy1);
            var followers_links = parse(dummy2);

            // ppl_who_dont_follow_back = following - followers

            var ppl_who_dont_follow_back = new Set([...following_links].filter(x => !followers_links.has(x)));

            console.log(ppl_who_dont_follow_back.size)
            console.log(ppl_who_dont_follow_back);
            return Array.from(ppl_who_dont_follow_back)
        } catch (e) {
            return null
        }
    }






    return (
        <div className="file-uploader-container bg_white py-4 px-4 rounded-md">
            <div {...getRootProps()} className={`border border-1 border-blue-500 p-10 rounded-md file-dropzone ${isDragActive ? 'active' : ''}`}>
                <input {...getInputProps()} />
                <p className="linear-wipe">Drag and drop <span className="font-bold">following</span> and <span className="font-bold">followers</span> files here, or click to select files</p>
            </div>
            {uploadedFiles.length > 0 && (
                <div className="file-content">
                    <h2 className='pt-4 '>Uploaded Files:</h2>
                    <ul>
                        {uploadedFiles.map((file, index) => (
                            <li key={index}>
                                <strong>{file.fileName}</strong> - {file.fileType}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {correctFilesUploaded && (
                <div className="flex justify-center items-center">
                    <button
                        className='special_button grow press'
                        onClick={() => {
                            var analyis = handle_analysis()
                            if (analyis) {
                                setRes(true)
                                setLinks(analyis)
                            } else {
                                toast.error("Error in parsing files; did you upload following.html and followers.html?")
                            }
                        }}
                    >
                        Run Analysis
                    </button>
                </div>
            )
            }
        </div>
    );
};

export default TextFileUploader;

