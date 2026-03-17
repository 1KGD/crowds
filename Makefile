build:
	wasm-pack build --release

watch:
	cargo-watch -- make

install:
	cargo install wasm-pack

install-dev:
	make install
	cargo install cargo-watch

clean:
	cargo clean
	rm -r pkg
	rm -r node_modules
	rm -r dist
	rm package-lock.json
	rm Cargo.lock