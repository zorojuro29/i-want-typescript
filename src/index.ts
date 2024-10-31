import http from 'http';
import si from 'systeminformation';

interface ISystemInformation {
    cpu: si.Systeminformation.CpuData;
    system: si.Systeminformation.SystemData;
    mem: si.Systeminformation.MemData;
    os: si.Systeminformation.OsData;
    currentLoad: si.Systeminformation.CurrentLoadData;
    processes: si.Systeminformation.ProcessesData;
    diskLayout: si.Systeminformation.DiskLayoutData[];
    networkInterfaces: si.Systeminformation.NetworkInterfacesData[];
}

// création serveur http

const server = http.createServer(async (req, res) =>{
    if (req.method==='GET' && req.url==='/api/v1/sysinfo'){
        try{
            const cpu = await si.cpu();
            const system = await si.system();
            const mem = await si.mem();
            const os = await si.osInfo();
            const currentLoad = await si.currentLoad();
            const processes = await si.processes();
            const diskLayout = await si.diskLayout();
            const networkInterfaces = await si.networkInterfaces() as si.Systeminformation.NetworkInterfacesData[];

            const systemInfo: ISystemInformation = {
                cpu,
                system,
                mem,
                os,
                currentLoad,
                processes,
                diskLayout,
                networkInterfaces,
            };

            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(systemInfo));
        }
        catch (error){
            console.log(error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end('Erreur lors de la récupération des informations systèmes.');
        }
    }
    else{
            res.writeHead(404, {'Content-Type':'text/plain'});
            res.end('404 Not Found');
        }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
});