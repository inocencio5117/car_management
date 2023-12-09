import mitt from 'mitt';

type Events = {
  search: string;
};

const emitter = mitt<Events>();

export default emitter;
