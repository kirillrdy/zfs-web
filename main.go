package main

import (
	"encoding/json"
	"fmt"
	"github.com/dustin/go-humanize"
	"github.com/kirillrdy/vidos/router"
	vidos_web "github.com/kirillrdy/vidos/web"
	"github.com/kirillrdy/web"
	"github.com/kirillrdy/web/css"
	"github.com/kirillrdy/web/html"
	"github.com/mistifyio/go-zfs"
	"log"
	"net/http"
	"os"
	"os/exec"
	"time"
)

func crash(err error) {
	if err != nil {
		log.Panic(err)
	}
}

var application vidos_web.Application = vidos_web.Application{Name: "ZFS", Menu: []vidos_web.Page{{Path: datasetsPath, Title: "Datasets"}}}

const datasetsPath web.Path = "/datasets"
const datasetsJSONPath web.Path = "/datasets.json"

func list(response http.ResponseWriter, request *http.Request) {
	hello := html.H1().Text("Hello World !")
	application.NewPage("Datasets", "/datasets").ToHTML(hello).WriteTo(response)
}

func listJSON(response http.ResponseWriter, request *http.Request) {
	//TODO obviously not *
	response.Header().Add("Access-Control-Allow-Origin", "*")
	response.Header().Add("Content-Type", "application/json")
	datasets, err := zfs.Filesystems("")
	crash(err)
	encoder := json.NewEncoder(response)
	encoder.Encode(&datasets)
}

func printDatasets() {
	datasets, err := zfs.Filesystems("")
	crash(err)
	for _, dataset := range datasets {
		fmt.Printf("%#v\t%v\t%v\t%v\n", dataset.Name, humanize.Bytes(dataset.Used), humanize.Bytes(dataset.Avail), humanize.Bytes(dataset.Referenced))
	}
}

func webInterface() {
	router.AddHandler(css.ResetCSSPath, css.ServeResetCSS)
	router.AddHandler(datasetsPath, list)
	router.AddHandler(datasetsJSONPath, listJSON)
	addr := ":3000"
	log.Printf("Listening on %v\n", addr)
	http.ListenAndServe(addr, nil)
}

func cleanUp(dataset *zfs.Dataset) {
	snapshots, err := dataset.Snapshots()
	crash(err)

	if len(snapshots) > 1440 {
		log.Print("starting")
		start := time.Now()
		for _, snapshot := range snapshots[0:10] {
			start := time.Now()
			err := snapshot.Destroy(0)
			crash(err)
			log.Printf("destroy %s", time.Since(start).String())
		}
		log.Printf("clean up %s", time.Since(start).String())
	}
}

func createSnapshot(dataset *zfs.Dataset) {
	for {
		now := time.Now()

		name := now.Format("2006-01-02-15:04:05")
		_, err := dataset.Snapshot(name, false)
		crash(err)

		time.Sleep(1 * time.Minute)
	}

}

func main() {

	npm := exec.Command("npm", "start")
	npm.Stdout = os.Stdout
	npm.Stderr = os.Stderr

	npm.Start()

	webInterface()

	//	dataset, err := zfs.GetDataset("zroot/usr/home")
	//	crash(err)

	//TODO lets park this for now and focus on web interface
	//	go createSnapshot(dataset)
	//	for {
	//
	//		cleanUp(dataset)
	//		time.Sleep(1 * time.Second)
	//	}
}
