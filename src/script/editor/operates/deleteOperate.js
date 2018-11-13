import {operationDelete} from '@/script/editor/id-editor/modules/operations/delete';

const deleteEntity = (context,id)=>{
  if(!id) return;
  let entity = context.entity(id);
  if(entity.type=='relation'){
    let arr = entity.members.map(el=>el.id);
    operationDelete(arr,context)();
  }else{
    operationDelete([id],context)();
  }
}

export {deleteEntity}