(module
  (type (;0;) (func (param i32 i32 i32 i32 i32 i64 i64 i32 i32) (result i32)))
  (type (;1;) (func (param i32 i64 i32) (result i32)))
  (type (;2;) (func (param i32 i32 i32 i32) (result i32)))
  (type (;3;) (func))
  (type (;4;) (func (param i32 i32 i32) (result i32)))
  (type (;5;) (func (param i32 i32 i32 i32 i32 i32 i32 i32 i32) (result i32)))
  (import "wasi_unstable" "clock_time_get" (func (;0;) (type 4)))
  (import "wasi_unstable" "path_open" (func (;1;) (type 5)))
  (import "wasi_unstable" "fd_write" (func (;2;) (type 2)))
  (func (;3;) (type 3)
    i32.const 0
    i64.const 1000
    i32.const 100
    call 4
    drop
    i32.const 12
    i32.const 12
    i32.const 12
    i32.const 12
    i32.const 12
    i64.const 12
    i64.const 12
    i32.const 12
    i32.const 12
    call 5
    drop
    i32.const 0
    i32.const 8
    i32.store
    i32.const 4
    i32.const 6
    i32.store
    i32.const 1
    i32.const 0
    i32.const 1
    i32.const 20
    call 2
    drop)
  (func (;4;) (type 1) (param i32 i64 i32) (result i32)
    local.get 0
    local.get 1
    i32.wrap_i64
    local.get 2
    call 0)
  (func (;5;) (type 0) (param i32 i32 i32 i32 i32 i64 i64 i32 i32) (result i32)
    local.get 0
    local.get 1
    local.get 2
    local.get 3
    local.get 4
    local.get 5
    i32.wrap_i64
    local.get 6
    i32.wrap_i64
    local.get 7
    local.get 8
    call 1)
  (memory (;0;) 1)
  (export "memory" (memory 0))
  (export "_start" (func 3))
  (data (;0;) (i32.const 8) "Done!\0a"))
