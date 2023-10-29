import { Card, Dialog, Divider, Grid, Typography } from "@mui/material";

// Implementacao do Dialog aberto ao clicar no processo
function Status({title, ammount}) {
    return (
      <Grid item lg={6}>
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

export default function ProcessDialog({ open, setOpen, data }) {
    const handleClose = () => {
        setOpen(false);
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <Card style={{ width: 400, height: 420, padding: "2rem"}}>
                <Grid container style={{marginBottom: "1rem"}} alignItems={"center"} justifyContent={"flex-start"} spacing={6}>
                    <Status title={"Nome"} ammount={data?.["Name"]} />
                </Grid>
                <Divider style={{ marginBottom: "1rem" }} />
                <Grid container spacing={2}>
                <Status title={"Número de threads"} ammount={data?.["Threads"]} />
                <Status title={"ID Processo"} ammount={data?.["Pid"]} />
                <Status title={"Estado"} ammount={data?.["State"]} />
                <Status title={"ID Processo Pai"} ammount={data?.["PPid"]} />
                <Status title={"ID Usuário"} ammount={data?.["Uid"]} />
                <Status title={"Memória Virtual Alocada"} ammount={data?.["VmSize"]} />
                <Status title={"Memória Trocada para o Disco"} ammount={data?.["VmSwap"]} />
                <Status title={"Memória Tabela de Página"} ammount={data?.["VmPTE"]} />
                </Grid>
            </Card>
        </Dialog>
    )
}