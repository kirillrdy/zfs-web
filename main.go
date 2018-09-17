package main

import (
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
)

func crash(err error) {
	if err != nil {
		log.Panic(err)
	}
}

var application vidos_web.Application = vidos_web.Application{Name: "ZFS", Menu: []vidos_web.Page{{Path: datasetsPath, Title: "Datasets"}}}

const datasetsPath web.Path = "/datasets"

func list(response http.ResponseWriter, request *http.Request) {

	hello := html.H1().Text("Hello World !")
	application.NewPage("Datasets", "/datasets").ToHTML(hello).WriteTo(response)

}

func main() {
	datasets, err := zfs.Filesystems("")
	crash(err)
	for _, dataset := range datasets {
		fmt.Printf("%#v%v\t%v\t%v\n", dataset.Name, humanize.Bytes(dataset.Used), humanize.Bytes(dataset.Avail), humanize.Bytes(dataset.Referenced))
	}

	router.AddHandler(css.ResetCSSPath, css.ServeResetCSS)
	router.AddHandler(datasetsPath, list)
	http.ListenAndServe(":3000", nil)
}
