build:
	wasm-pack build

watch:
	cargo-watch -- make build

install:
	cargo install wasm-pack

install-dev:
	make install
	cargo install cargo-watch