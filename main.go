package main

import (
	"fmt"
	"github.com/dustin/go-humanize"
	"github.com/mistifyio/go-zfs"
	"log"
)

func crash(err error) {
	if err != nil {
		log.Panic(err)
	}
}

func main() {
	datasets, err := zfs.Filesystems("")
	crash(err)
	for _, dataset := range datasets {
		fmt.Printf("%#v%v\t%v\t%v\n", dataset.Name, humanize.Bytes(dataset.Used), humanize.Bytes(dataset.Avail), humanize.Bytes(dataset.Referenced))
	}

}
