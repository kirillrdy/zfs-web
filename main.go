package main

import (
	"encoding/json"
	"fmt"
	"github.com/dustin/go-humanize"
	"github.com/kirillrdy/vidos/router"
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

const datasetsJSONPath = "/datasets.json"

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
	router.AddHandler(datasetsJSONPath, listJSON)
	addr := ":3000"

	npm := exec.Command("npm", "start")
	npm.Stdout = os.Stdout
	npm.Stderr = os.Stderr

	npm.Start()

	log.Printf("Listening on %v\n", addr)
	http.ListenAndServe(addr, nil)

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
