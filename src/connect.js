import {NevinhaComponent, NevinhaDOM} from 'nevinha-js';

export function Connect(mapDispatchToProps, mapStateToProps) {
  return function(WrappedComponent) {
    class Connect extends NevinhaComponent {
      constructor(props, context){
        super(props, context);
        const mappedDispatch = mapDispatchToProps(this.getDispatch());

        if(mapStateToProps) {
          this.state = {
            mappedDispatch,
            mappedState: mapStateToProps(this.getStoreState())
          }

          this.unsubscribe = this.subscribeStore();

        }else {
          this.state = {
            mappedDispatch,
          }
        }

      }

      componentUnmount(){
        this.unsubscribe();
      }

      subscribeStore(){
        const store = this.context.store;

        return store.subscribe(() => {
          this.setState({
            mappedState: mapStateToProps(this.getStoreState())
          });
        });
      }

      getStoreState() {
        return this.context.store.getState();
      }

      getDispatch(){
        return this.context.store.dispatch;
      }

      render() {
        const {mappedState, mappedDispatch} = this.state;
        const data = {
          ...mappedState,
          ...mappedDispatch,
          ...this.props
        }

        if(this.children) {
          return <WrappedComponent {...data}  />
        }

        return (
          <WrappedComponent {...data}>
            {this.children}
          </WrappedComponent>
        )
      }
    }

    return Connect;
  }
}