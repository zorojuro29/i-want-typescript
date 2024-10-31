import http from 'http';
import request from 'supertest'; // pour faire des requêtes HTTP dans les tests
import si from 'systeminformation';
//import { ISystemInformation } from '/home/struilju/cours_cloud/i-want-typescript/src/index.ts'; // Mettez le bon chemin vers votre fichier source

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

const server = http.createServer(async (req, res) => {
    if (req.method === 'GET' && req.url === '/api/v1/sysinfo') {
        try {
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

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(systemInfo));
        } catch (error) {
            console.error(error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Erreur lors de la récupération des informations systèmes.');
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

describe('GET /api/v1/sysinfo', () => {
    it('should return system information', async () => {
        const response = await request(server).get('/api/v1/sysinfo');

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        expect(response.body).toHaveProperty('cpu');
        expect(response.body).toHaveProperty('system');
        expect(response.body).toHaveProperty('mem');
        expect(response.body).toHaveProperty('os');
        expect(response.body).toHaveProperty('currentLoad');
        expect(response.body).toHaveProperty('processes');
        expect(response.body).toHaveProperty('diskLayout');
        expect(response.body).toHaveProperty('networkInterfaces');
    });

    it('should return 404 for an invalid route', async () => {
        const response = await request(server).get('/api/v1/invalid-route');

        expect(response.status).toBe(404);
        expect(response.text).toBe('404 Not Found');
    });
});
