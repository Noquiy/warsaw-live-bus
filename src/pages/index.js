import Head from 'next/head';
import GoogleMap from '../../components/GoogleMap';
import BusInputField from '../../components/BusInputField';
import styles from '../styles/styles.module.css';
import { useState } from 'react';


const Home = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar state
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Warsaw Bus Live</title>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `(g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src="https://maps."+c+"apis.com/maps/api/js?"+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})
                        ({key: "AIzaSyBFRZFqQZhHSkfeKUGDOj8t9_EQNaURWYs", v: "weekly"});`,
                    }}
                />
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
                <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@300;700&family=Noto+Sans+Mono:wght@200;300&family=Poppins:wght@300&family=Raleway:wght@100;200;300&display=swap" rel="stylesheet"></link>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            </Head>
            <div className={isSidebarOpen ? styles['sidebar-open'] : styles['sidebar']}>
                {/* Add your sidebar content here */}
                    <BusInputField/>
            </div>
            <div className={isSidebarOpen ? styles['icon-background-open'] : styles['icon-background']}>
                <span className={`material-symbols-outlined ${ styles['button']}`} onClick={toggleSidebar}>
                    {isSidebarOpen  ? 'close' : 'menu'}
                </span>
            </div>
            <div className={styles['map-container']}>
                <GoogleMap />
            </div>

        </div>
    );
};

export default Home;