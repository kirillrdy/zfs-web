package main

import (
	"encoding/json"
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

	npm := exec.Command("yarn", "start")
	npm.Stdout = os.Stdout
	npm.Stderr = os.Stderr
	npm.Stdin = os.Stdin

	err := npm.Start()
	crash(err)

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
