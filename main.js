gsap.registerPlugin(ScrollTrigger);const lenis=new Lenis({duration:1.5,easing:a=>Math.min(1,1.001-Math.pow(2,-10*a)),smooth:!0});function raf(a){lenis.raf(a),requestAnimationFrame(raf)}requestAnimationFrame(raf);const audio=document.getElementById("bg-music"),musicBtn=document.getElementById("music-btn"),musicStatus=musicBtn.querySelector(".status-text");let isPlaying=!1;function toggleMusic(){isPlaying?(audio.pause(),musicBtn.classList.remove("playing"),musicStatus.textContent="PAUSED"):audio.play().then(()=>{musicBtn.classList.add("playing"),musicStatus.textContent="ONLINE"}).catch(a=>console.log("Audio block:",a)),isPlaying=!isPlaying}musicBtn.addEventListener("click",toggleMusic),window.addEventListener("load",()=>{audio.volume=.4,audio.play().then(()=>{isPlaying=!0,musicBtn.classList.add("playing"),musicStatus.textContent="ONLINE"}).catch(()=>{document.body.addEventListener("click",()=>{!isPlaying&&audio.paused&&audio.play().then(()=>{isPlaying=!0,musicBtn.classList.add("playing"),musicStatus.textContent="ONLINE"}).catch(()=>{})},{once:!0})})});const burger=document.getElementById("burger-trigger"),overlay=document.getElementById("menu-overlay"),links=document.querySelectorAll(".menu-link");burger.addEventListener("click",()=>{burger.classList.toggle("active"),overlay.classList.toggle("open")}),links.forEach(a=>{a.addEventListener("click",()=>{burger.classList.remove("active"),overlay.classList.remove("open")})});const terminalText=document.getElementById("terminal-text"),loader=document.getElementById("loader"),bootSequence=["Arch Linux Boot Loader v2.4",":: Loading kernel modules...",":: Mounting /dev/sda2 on /...","[ OK ] Filesystems mounted.",":: Starting DrowBlackTw session...","pacman -Syu threejs gsap lenis","[ OK ] System ready."];let lineIndex=0;function typeLine(){if(lineIndex<bootSequence.length){const a=document.createElement("div");a.textContent=`> ${bootSequence[lineIndex]}`,terminalText.appendChild(a),terminalText.scrollTop=terminalText.scrollHeight,lineIndex++,setTimeout(typeLine,150*Math.random()+50)}else setTimeout(()=>{gsap.to(loader,{opacity:0,duration:.8,onComplete:()=>loader.style.display="none"})},800)}typeLine();const scene=new THREE.Scene;scene.fog=new THREE.FogExp2(0,.02);const camera=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,.1,100);camera.position.z=5;const renderer=new THREE.WebGLRenderer({canvas:document.querySelector("#webgl"),antialias:!0,alpha:!0});renderer.setSize(window.innerWidth,window.innerHeight),renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));let mouseWorld=new THREE.Vector3(0,0,0);const cursorDot=document.querySelector(".cursor-dot"),cursorCircle=document.querySelector(".cursor-circle");function updateMouseWorldPosition(a,b){const c=camera.position.z,d=THREE.MathUtils.degToRad(camera.fov),e=2*Math.tan(d/2)*c,f=e*camera.aspect;mouseWorld.x=a*(f/2),mouseWorld.y=b*(e/2),mouseWorld.z=0}window.addEventListener("mousemove",a=>{gsap.to(cursorDot,{x:a.clientX,y:a.clientY,duration:.1}),gsap.to(cursorCircle,{x:a.clientX,y:a.clientY,duration:.3});const b=2*(a.clientX/window.innerWidth)-1,c=2*-(a.clientY/window.innerHeight)+1;updateMouseWorldPosition(b,c)});const bhGeo=new THREE.SphereGeometry(1.2,64,64),bhMat=new THREE.ShaderMaterial({uniforms:{glowColor:{value:new THREE.Color(7340287)},viewVector:{value:camera.position}},vertexShader:`
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        void main() {
            vNormal = normalize(normalMatrix * normal);
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            vViewPosition = -mvPosition.xyz;
            gl_Position = projectionMatrix * mvPosition;
        }
    `,fragmentShader:`
        uniform vec3 glowColor;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        void main() {
            vec3 normal = normalize(vNormal);
            vec3 viewDir = normalize(vViewPosition);
            // Fresnel Effect: Kenarlara doğru parlaklık
            float fresnel = pow(1.0 - dot(normal, viewDir), 3.0);
            // Merkez Siyah (0,0,0), Kenarlar Mor (glowColor)
            vec3 color = mix(vec3(0.0), glowColor, fresnel * 0.5); 
            gl_FragColor = vec4(color, 1.0);
        }
    `}),blackHole=new THREE.Mesh(bhGeo,bhMat);scene.add(blackHole);const diskGeo=new THREE.TorusGeometry(1.8,.35,64,120);diskGeo.applyMatrix4(new THREE.Matrix4().makeScale(1,1,.1)),diskGeo.rotateX(Math.PI/1.7);const diskMat=new THREE.ShaderMaterial({uniforms:{time:{value:0}},transparent:!0,side:THREE.DoubleSide,vertexShader:`
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,fragmentShader:`
        uniform float time;
        varying vec2 vUv;
        void main() {
            float noise = sin(vUv.x * 20.0 + time * 2.0) * 0.5 + 0.5;
            float alpha = smoothstep(0.0, 0.5, noise) * 0.7;
            vec3 color = mix(vec3(0.0, 0.8, 1.0), vec3(0.6, 0.0, 1.0), vUv.y);
            gl_FragColor = vec4(color, alpha);
        }
    `}),accretionDisk=new THREE.Mesh(diskGeo,diskMat);scene.add(accretionDisk);const pCount=600,pGeo=new THREE.BufferGeometry,pPos=new Float32Array(1800),pVel=new Float32Array(1800),pLife=new Float32Array(600);function setRandomPos(a){const b=8+5*Math.random(),c=2*(Math.random()*Math.PI);pPos[a]=b*Math.cos(c),pPos[a+1]=b*Math.sin(c),pPos[a+2]=4*(Math.random()-.5),pLife[a]=Math.random(),pVel[a]=0,pVel[a+1]=0,pVel[a+2]=0}for(let a=0;a<pCount;a++)setRandomPos(3*a);pGeo.setAttribute("position",new THREE.BufferAttribute(pPos,3));const pMat=new THREE.PointsMaterial({color:16777215,size:.04,transparent:!0,opacity:.9}),interactiveParticles=new THREE.Points(pGeo,pMat);scene.add(interactiveParticles);const bgCount=2e3,bgGeo=new THREE.BufferGeometry,bgPos=new Float32Array(6000);for(let a=0;a<6000;a++)bgPos[a]=60*(Math.random()-.5);bgGeo.setAttribute("position",new THREE.BufferAttribute(bgPos,3));const bgStars=new THREE.Points(bgGeo,new THREE.PointsMaterial({color:5592405,size:.03,transparent:!0,opacity:.5}));bgStars.position.z=-10,scene.add(bgStars);const clock=new THREE.Clock;function animate(){const a=clock.getElapsedTime();diskMat.uniforms.time.value=a,accretionDisk.rotation.z-=.005,bgStars.rotation.y=.02*a;const b=interactiveParticles.geometry.attributes.position.array;for(let a=0;a<pCount;a++){const c=3*a;let d=b[c],e=b[c+1],f=b[c+2];const g=mouseWorld.x-d,h=mouseWorld.y-e,i=mouseWorld.z-f,j=g*g+h*h+i*i,k=Math.sqrt(j);if(.2>k)setRandomPos(c),b[c]=pPos[c],b[c+1]=pPos[c+1],b[c+2]=pPos[c+2];else{const a=3/(j+.1);pVel[c]+=.002*(g*a),pVel[c+1]+=.002*(h*a),pVel[c+2]+=.002*(i*a),pVel[c]*=.94,pVel[c+1]*=.94,pVel[c+2]*=.94,b[c]+=pVel[c],b[c+1]+=pVel[c+1],b[c+2]+=pVel[c+2]}}interactiveParticles.geometry.attributes.position.needsUpdate=!0,renderer.render(scene,camera),requestAnimationFrame(animate)}animate(),ScrollTrigger.create({trigger:"#smooth-wrapper",start:"top top",end:"bottom bottom",scrub:1,onUpdate:a=>{const b=a.progress;camera.position.z=5-3*b,blackHole.rotation.y=b*Math.PI,blackHole.rotation.x=.5*b,accretionDisk.rotation.x=Math.PI/1.7+.5*b}}),window.addEventListener("resize",()=>{camera.aspect=window.innerWidth/window.innerHeight,camera.updateProjectionMatrix(),renderer.setSize(window.innerWidth,window.innerHeight)});