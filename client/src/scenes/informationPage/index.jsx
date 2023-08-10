import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import Navbar from "scenes/navbar";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ComputerIcon from '@mui/icons-material/Computer';
import SecurityIcon from '@mui/icons-material/Security';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
const InformationPage=()=>{

    const token=Boolean(useSelector((state=>state.token)));
    const navigate=useNavigate();

    //console.log(token);

    useEffect(()=>{
      if(token){
        navigate("/home");
      }
    },[]);
    return (
        <Box>
            <Box position="sticky" top="0" zIndex="100">
             <Navbar />
             </Box>

            <section>
                <div style={{textAlign:"center"}}className="container">
                    <div style={{fontSize:"100px"}}className="masthead-subheading">Dobro došli </div>
                    <div className="masthead-heading text-uppercase">Saznajte više o našem projektu</div>
                    <a className="btn btn-primary btn-xl text-uppercase" href="#services">Vodi me</a>

                </div>
            </section>
                
            <section className="page-section" id="services">
            <div style={{textAlign:"center"}}className="container">
                <div className="text-center">
                    <h2 className="section-heading text-uppercase">Usluge</h2>
                    <h3 className="section-subheading text-muted">Naša aplikacija nudi</h3>
                </div>
                <div  className="row text-center">
                    <div className="col-md-4">
                        <ShoppingCartIcon sx={{ fontSize: "100px" }} />
                        <h4 className="my-3">Trgovinu valutama</h4>
                        <p className="text-muted">Našu aplikaciju možete koristiti za praćenje profesionalnih trgovaca valutama, kao i postavljanje informacija o svojim trgovanjima ukoliko ste profesionalni trgovalac</p>
                    </div>
                    <div className="col-md-4">
                        <ComputerIcon sx={{ fontSize: "100px" }} />
                        <h4 className="my-3">Jednostavan korisnički interfejs</h4>
                        <p className="text-muted">Vrlo jednostavno možete koristiti naše usluge, kao i kod ostalih društvenih mreža poput instagrama, tvitera i drugih</p>
                    </div>
                    <div className="col-md-4">
                        <SecurityIcon sx={{ fontSize: "100px" }} />
                        <h4 className="my-3">Bezbednost</h4>
                        <p className="text-muted">Garantujemo za bezbednost vaših podataka</p>
                    </div>
                    
                </div>
                <a className="btn btn-primary btn-xl text-uppercase" href="#about">Dalje</a>
            </div>
            </section>

            
        <section className="page-section" id="about">
            <div className="container">
                <div className="text-center">
                    <h2 className="section-heading text-uppercase">O samom projektu</h2>
                    <h3 className="section-subheading text-muted"></h3>
                </div>
                <ul className="timeline">
                    <li>
                        <div className="timeline-image"><img className="rounded-circle img-fluid" src="assets/img/about/1.jpg" alt="..." /></div>
                        <div className="timeline-panel">
                            <div className="timeline-heading">
                                <h4>Februar 2023.</h4>
                                <h4 className="subheading">Ideja</h4>
                            </div>
                            <div className="timeline-body"><p className="text-muted"> Iz velike želje za radom finansijama vođa tima je dobio ideju o umrežavanju trgovalaca valutama, kako početnika, tako i profesionalaca</p></div>
                        </div>
                    </li>
                    <li className="timeline-inverted">
                        <div className="timeline-image"><img className="rounded-circle img-fluid" src="assets/img/about/2.jpg" alt="..." /></div>
                        <div className="timeline-panel">
                            <div className="timeline-heading">
                                <h4>Mart 2023.</h4>
                                <h4 className="subheading">Tim je sastavljen</h4>
                            </div>
                            <div className="timeline-body"><p className="text-muted">Sklopljeni su dogovori sa ostalim članovima tima, predstavljene ideje i usvojen konsenzus o načinu implementacije, razvoja i održavanja društvene platforme za trejdere</p></div>
                        </div>
                    </li>
                    <li>
                        <div className="timeline-image"><img className="rounded-circle img-fluid" src="assets/img/about/3.jpg" alt="..." /></div>
                        <div className="timeline-panel">
                            <div className="timeline-heading">
                                <h4>Api i maj 2023.</h4>
                                <h4 className="subheading">Rad na projektu</h4>
                            </div>
                            <div className="timeline-body"><p className="text-muted">Pisanje dokumentacije, implementacija platforme, savetovanje i ostvarivanje konačnog cilja</p></div>
                        </div>
                    </li>
                    <li className="timeline-inverted">
                        <div className="timeline-image"><img className="rounded-circle img-fluid" src="assets/img/about/4.jpg" alt="..." /></div>
                        <div className="timeline-panel">
                            <div className="timeline-heading">
                                <h4>Jun 2023.</h4>
                                <h4 className="subheading">Predstavljanje projekta profesorima</h4>
                            </div>
                            <div className="timeline-body"><p className="text-muted">Završna faza projekta, prezentovanje pred profesorima, dobijanje konačne ocene</p></div>
                        </div>
                    </li>
                    <li className="timeline-inverted">
                        <div className="timeline-image">
                            <h4>
                                Podrži nas!
                            </h4>
                        </div>
                    </li>
                </ul>
            </div>
        </section>
            
        <section className="page-section bg-light" id="team">
            <div className="container">
                <div className="text-center">
                    <h2 style={{color: "black"}} className="section-heading text-uppercase">Naš tim</h2>
                    
                </div>
                <div className="row">
                    <div className="col-lg-4">
                        <div className="team-member">
                            <img className="mx-auto rounded-circle" src="assets/img/team/1.jpg" alt="..." />
                            <h4 style={{color: "black"}}>Filip Dojčinović</h4>
                            <p className="text-muted">Vođa tima</p>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="team-member">
                            <img className="mx-auto rounded-circle" src="assets/img/team/2.jpg" alt="..." />
                            <h4 style={{color: "black"}}>Jovan Dojčinović</h4>
                            <p className="text-muted">Frontend developer u pokušaju</p>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="team-member">
                            <img className="mx-auto rounded-circle" src="assets/img/team/3.jpg" alt="..." />
                            <h4 style={{color: "black"}}>Nikola Marković</h4>
                            <p className="text-muted">Backend developer</p>
                             </div>
                    </div>
                </div>
            </div>
        </section>

        
        </Box>
    )
}

export default InformationPage;