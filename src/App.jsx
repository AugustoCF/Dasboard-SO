
import { Card, CircularProgress, Grid, Table, TableBody, TableCell, TableRow, Typography } from "@mui/material";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import { useEffect, useState } from "react";
import ProcessDialog from "./Dialog";

// npx vite
ChartJS.register(ArcElement, Tooltip, Legend);

async function getData() { // 2
  const responseProcess = await axios.post('http://127.0.0.1:8000/getprocess/');
  const responseMem = await axios.post('http://127.0.0.1:8000/getmeminfo/');
  const responseCPU = await axios.post('http://127.0.0.1:8000/getcpuinfo/');
  return({"process" :responseProcess.data , "mem" : responseMem.data, "cpu" : responseCPU.data}); // {"process" :responseProcess.data , "mem" : responseMem.data}
}

function Status({title, ammount}) {
  return (
    <Grid item>
      <Grid container direction={'column'}>
        <Grid item>
          <Typography variant="subtitle1">{title}</Typography>
        </Grid>
        <Grid item>
          <Typography variant="h5">{ammount}</Typography>
        </Grid>
      </Grid>
    </Grid>
  )
}

function parseResponse(item) {
  let paramList = JSON.parse(JSON.stringify(item)).split("\n");
  let dataObj = {};
  paramList.forEach((item)=> { dataObj = {[item.split(":\t")[0]]: item.split(":\t")[1], ...dataObj }});      
  return dataObj;
}

function parseCPU (data) {
  if (typeof(data) === 'string') {
    const lines = data.split('\n');
    const cpuObj = {};

    let currentKey = null;
    for (const line of lines) {
      if (line.trim() === '') {
        continue;
      }

      const [key, value] = line.split(':').map(part => part.trim());
      if (value) {
        cpuObj[key] = value;
        currentKey = key;
      } else {
        if (currentKey) {
          cpuObj[currentKey] += `\n${line.trim()}`;
        }
      }
    }
    return cpuObj;
  }
}

function parseMem (data) {
  if (typeof(data) === 'string') {
    const lines = data.split('\n');
    const memObj = {};

    for (const line of lines) {
      const parts = line.split(':');
      if (parts.length === 2) {
        const key = parts[0].trim();
        const value = parseInt(parts[1].trim(), 10);
        memObj[key] = value;
      }
    }

    return memObj;
  }
}

function DataTable({dataList}) {
  const [open, setOpen] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState({});

  const handleOpen = (process) => {
    setOpen(true);
    setSelectedProcess(process);
  }

  return (
    <Card style={{ height: 400, width: 600,overflow: "auto"}}>
      <Table>
        <TableBody>
          <TableRow key={0}>
              <TableCell>
                Name
              </TableCell>
              <TableCell>
                Número de Threads
              </TableCell>
              <TableCell>
                PID
              </TableCell>
              <TableCell>
                Estado do processo
              </TableCell>
            </TableRow>
          {dataList.map((item) =>{
            const dataObj = parseResponse(item);
            return (
            <TableRow key={item} hover onClick={() => handleOpen(dataObj)} sx={{ cursor: 'pointer' }}>
              <TableCell>
                {dataObj['Name']}
              </TableCell>
              <TableCell>
                {dataObj['Threads']}
              </TableCell>
              <TableCell>
                {dataObj['Pid']}
              </TableCell>
              <TableCell>
                {dataObj['State']}
              </TableCell>
            </TableRow>)}
          )}
        </TableBody>
      </Table>
      <ProcessDialog open={open} setOpen={setOpen} data={selectedProcess} />
    </Card>
  )
}

// 1 Criar estado
// 2 Criar função para chamar rota
// 3 Atualizar estado

function App() {
  const [process, setProcess] = useState([]);// 1
  const [mem, setMem] = useState([]);
  const [cpu, setCPU] = useState([]);
  const [count, setCount] = useState(0);

  const updateData = () => {
    getData().then((res) => setProcess(res.process)); // 3
    getData().then((res) => setMem(res.mem));
    getData().then((res) => setCPU(res.cpu));
  }

  const cpuObject = parseCPU(cpu);
  const memObject = parseMem(mem);

  const data_donut = {
    labels: ['Memória Utilizada', 'Memória Livre'],
    datasets: [
      {
        label: '',
        data: memObject ? [memObject["MemTotal"] - memObject["MemFree"], memObject["MemFree"]]:[], // data: [mem.CPU ?? 0, 28, 5, 6],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const data_donut2 = {
    labels: ['Memória Swap Utilizada', 'Memória Swap Livre'],
    datasets: [
      {
        label: '',
        data: memObject ? [memObject["SwapTotal"] - memObject["SwapFree"], memObject["SwapFree"]]:[], // data: [mem.CPU ?? 0, 28, 5, 6],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    console.log(count);
    setTimeout(() => {
      setCount(count + 1);
      updateData();
    }, 2000);
    if(count > 100) setCount(0);
  }, [count]);

  return (
    <> {cpuObject ? 
    <Grid container style={{width: 1280, padding:"2rem"}} spacing={3} direction={'column'}>
      <Grid item>
        <Grid container spacing={2} justifyContent={'center'}>
            <Status title={'Modelo do CPU'} ammount={cpuObject?.["model name"]} />
            <Status title={'Fabricante'} ammount={cpuObject?.["vendor_id"]} />
            <Status title={'Núcleos'} ammount={cpuObject?.["cpu cores"]} />
            <Status title={'Tamanho da Cache'} ammount={cpuObject?.["cache size"]} />
            <Status title={'Frequência do CPU (MHz)'} ammount={cpuObject?.["cpu MHz"]} />
        </Grid>
      </Grid>
      <Grid item>
      <Grid container justifyContent={'center'} spacing={3}>
        <Grid item lg={6}>
          <DataTable dataList={process} />
        </Grid>
        <Grid item  lg={3}>
          <Doughnut
            data={data_donut}
          />
        </Grid>
        <Grid item  lg={3}>
          <Doughnut
            data={data_donut2}
          />
        </Grid>
      </Grid></Grid></Grid>: <Grid container style={{height: "100%", width: "100%", marginLeft: 640 }} alignItems={"center"}><CircularProgress /></Grid>}
      <Grid container style={{padding: '2rem', backgroundColor: '#e2e2e2', width: '100vw', height: 100}}>
        <Typography>
          Dashboard criado por: Augusto Freitas e Vitor Gabriel
        </Typography>
      </Grid>
    </>
  )

}

export default App
